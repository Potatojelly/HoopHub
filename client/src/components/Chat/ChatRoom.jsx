import React, { useEffect} from 'react';
import styles from './ChatRoom.module.css'
import {TbMessageCirclePlus} from "react-icons/tb"
import ChatCard from './ChatCard';
import {useSaveLastReadMessage} from '../../hooks/useChatRoomData';
import {useNavigate} from "react-router-dom";
import {useQueryClient} from '@tanstack/react-query';
import { useMyProfileData } from '../../hooks/useMyProfileData';
import LoadingSpinner from '../Loader/LoadingSpinner';
import { useParams } from 'react-router-dom';

export default function ChatRoom({chatRooms, isFetching, isSuccess, socket}) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const myParam = useParams();
    const chatRoomID = myParam.chatRoomID;
    const {data:profileData} = useMyProfileData();
    const {mutate:saveLastReadMessage} = useSaveLastReadMessage();

    async function updateSelectedChatRoom (newMessageReceived) {
        if(queryClient.getQueryData(["direct-chatroom-message",newMessageReceived.chat.id])) {
            if(newMessageReceived.chat.id === chatRoomID) saveLastReadMessage(chatRoomID);
            queryClient.setQueryData(["direct-chatroom-message",newMessageReceived.chat.id], (oldData)=>{
                return ({
                    ...oldData,
                    pages: [
                        ...oldData.pages.slice(0,-1),
                        {
                            ...oldData.pages[oldData.pages.length-1],
                            result: [...oldData.pages[oldData.pages.length-1].result, newMessageReceived],
                        }
                    ],
                })
            })
        }        
    }

    async function newMessage (newMessageReceived) {
        const updatedLastestMessage = {content:newMessageReceived.content,
                                        createdAt:newMessageReceived.createdAt,
                                        id:newMessageReceived.id,
                                        image:newMessageReceived.image}

        queryClient.setQueryData(["direct-chatrooms"], (oldData)=>{
            const result = oldData.chats.map((chatRoom)=>{
                if(chatRoom.id === newMessageReceived.chat.id) {
                    const updatedChatRoom = {...chatRoom,
                                            latestMessage:updatedLastestMessage,
                                            unReadMessageCount:newMessageReceived.chat.id === chatRoomID ? 0 : chatRoom.unReadMessageCount+1}; 
                    return updatedChatRoom;
                } else {
                    return chatRoom;
                }
            })
            return {
                ...oldData,
                chats: result
            }
        })

        updateSelectedChatRoom(newMessageReceived);
    }

    const newChatRoomMessage = (newChatRoomInvited) => {
        queryClient.setQueryData(["direct-chatrooms"], (oldData)=>{
            const newChatRoom = {...newChatRoomInvited}
            return {
                ...oldData,
                chats: [newChatRoom,...oldData.chats]
            } 
        })
    }

    const invitationMessage = (invitationMessage) => {
        const updatedLastestMessage = {content:invitationMessage.content,
                                        createdAt:invitationMessage.createdAt,
                                        id:invitationMessage.id,
                                        image:invitationMessage.image}

            queryClient.setQueryData(["direct-chatrooms"], (oldData)=>{
                const result = oldData.chats.map((chatRoom)=>{
                    if(chatRoom.id === invitationMessage.chat.id) {
                        const updatedChatRoom = {...chatRoom,
                                                users: invitationMessage.chat.users,
                                                latestMessage:updatedLastestMessage,
                                                unReadMessageCount:invitationMessage.chat.id === chatRoomID ? 0 : chatRoom.unReadMessageCount+1}; 
                        return updatedChatRoom;
                    } else {
                        return chatRoom;
                    }
                })

                return {
                    ...oldData,
                    chats: result
                }
            })
        updateSelectedChatRoom(invitationMessage);
    }

    const exitMessage = (exitMessage) => {
        const updatedLastestMessage = {content:exitMessage.content,
                                        createdAt:exitMessage.createdAt,
                                        id:exitMessage.id,
                                        image:exitMessage.image}
        queryClient.setQueryData(["direct-chatrooms"], (oldData)=>{
            const result = oldData.chats.map((chatRoom)=>{
            if(chatRoom.id === exitMessage.chat.id) {
                const updatedChatRoom = {...chatRoom,
                                        users: chatRoom.users.filter((user)=>user.nickname !== exitMessage.sender.nickname),
                                        leftUsers: chatRoom.leftUsers ? [...chatRoom.leftUsers, exitMessage.sender] : [exitMessage.sender],
                                        latestMessage:updatedLastestMessage,
                                        unReadMessageCount:exitMessage.chat.id === chatRoomID ? 0 : chatRoom.unReadMessageCount+1}
                return updatedChatRoom;
            } else {
                return chatRoom;
            }
        })

            return {
                ...oldData,
                chats: result
            }
        })

        updateSelectedChatRoom(exitMessage);
    }

    const kickoutMessage = (kickoutMessage) => {
        if(kickoutMessage.kickedUser.nickname === profileData?.nickname) {
            const updatedChatRoom = chatRooms.filter((chatRoom)=>chatRoom.id !== kickoutMessage.chat.id);
            queryClient.setQueryData(["direct-chatrooms"], (oldData)=>{
                return {
                    ...oldData,
                    chats: updatedChatRoom
                }
            })
            if(kickoutMessage.sender.system && kickoutMessage.chat.id === chatRoomID) {
                window.alert("You are kicked out of the room");
                navigate("/messages/inbox");
            }
        } else {
            const updatedLastestMessage = {content:kickoutMessage.content,
                                            createdAt:kickoutMessage.createdAt,
                                            id:kickoutMessage.id,
                                            image:kickoutMessage.image}
            queryClient.setQueryData(["direct-chatrooms"], (oldData)=>{
                const result = oldData.chats.map((chatRoom)=>{
                    if(chatRoom.id === kickoutMessage.chat.id) {
                    const updatedChatRoom = {...chatRoom,
                                        users: chatRoom.users.filter((user)=>user.nickname !== kickoutMessage.kickedUser.nickname),
                                        leftUsers: chatRoom.leftUsers ? [...chatRoom.leftUsers, kickoutMessage.kickedUser] :[kickoutMessage.kickedUser],
                                        latestMessage:updatedLastestMessage,
                                        unReadMessageCount:kickoutMessage.chat.id === chatRoomID ? 0 : chatRoom.unReadMessageCount+1}; 
                        return updatedChatRoom;
                    } else {
                        return chatRoom;
                    }
                })
                return {
                    ...oldData,
                    chats: result
                }
            })
            updateSelectedChatRoom(kickoutMessage);
        }
    }

    const changeChatNameMessage = (chatNameMessage) => {
        const updatedLastestMessage = {content:chatNameMessage.content,
                                        createdAt:chatNameMessage.createdAt,
                                        id:chatNameMessage.id,
                                        image:chatNameMessage.image}

        queryClient.setQueryData(["direct-chatrooms"], (oldData)=>{
            const result = oldData.chats.map((chatRoom)=>{
                if(chatRoom.id === chatNameMessage.chat.id) {
                const updatedChatRoom = {...chatRoom,
                                        chatName:chatNameMessage.chat.chatName,
                                        latestMessage:updatedLastestMessage,
                                        unReadMessageCount:chatNameMessage.chat.id === chatRoomID ? 0 : chatRoom.unReadMessageCount+1}; 
                    return updatedChatRoom;
                } else {
                    return chatRoom;
                }
            })
            return {
                ...oldData,
                chats: result
            }
        })

        updateSelectedChatRoom(chatNameMessage);
    }

    useEffect(()=>{
        if(socket && isSuccess) {
            socket.on("new message received",async (message)=>{newMessage(message)});
            socket.on("new chat message received",(message)=>{newChatRoomMessage(message)});
            socket.on("exit message received",(message)=>{exitMessage(message)});
            socket.on("kickout message received",(message)=>{kickoutMessage(message)});
            socket.on("invite message received",(message)=>{invitationMessage(message)});
            socket.on("change chat name message received",(message)=>{changeChatNameMessage(message)});
        }

        return () => {
            if (socket) {
                socket.off("new message received");
                socket.off("new chat message received");
                socket.off("exit message received");
                socket.off("kickout message received");
                socket.off("invite message received");
                socket.off("change chat name message received")
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[socket,isSuccess,chatRoomID]); 

    const searchUser = () => {
        navigate("/messages/search-user", {state : chatRooms});
    }

    return (
        <div className={styles.chatRoomContainer}>
            <div className={styles.chatHeader}>
                <span className={styles.headerTitle}>Chats</span>
                <button className={styles.addBtn} onClick={searchUser}>
                    <TbMessageCirclePlus className={styles.addIcon}/>
                </button>
            </div>
            <div className={styles.listsContainer}>
                {isFetching && <div className={styles.loadingSpinner}><LoadingSpinner/></div>}
                <ul className={styles.directMsgList}>
                    {chatRooms && chatRooms.map((chatRoom)=><ChatCard key={chatRoom.id} 
                                                                    chatRoom={chatRoom}/>)}
                </ul>
            </div>
        </div>
    );
}

