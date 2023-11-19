import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ChatScreen.module.css';
import {AiOutlinePicture} from "react-icons/ai";
import {ImExit} from "react-icons/im";
import MyMessage from './MyMessage';
import OpponentMessage from './OpponentMessage';
import ChatParticipants from './ChatParticipants';
import {useChatName, useChatRoomMessageData, useChatRoomsData, useExitChatRoom, useInviteUsers, useKickoutUser, useSaveLastReadMessage, useSendImageMessage, useSendMessage,} from '../../hooks/useChatRoomData';
import {useQueryClient} from '@tanstack/react-query';
import {v4 as uuidv4} from "uuid";
import SystemMessage from './SystemMessage';
import { useChatRoomID } from '../../context/ChatRoomContext';
import {useNavigate} from "react-router-dom";
import LoadingSpinner from '../Loader/LoadingSpinner';
import { useSocket } from '../../context/SocketContext';
import { simplifyDateForChatRoom, simplifyTimeForMsg } from '../../date';
import {AiFillEdit} from "react-icons/ai";
import { useMyProfileData } from '../../hooks/useMyProfileData';

export default function ChatScreen() {
    const [enable,setEnable] = useState(true);
    const [editChatName,setEditChatName] = useState(false);
    const [chatName,setChatName] = useState("");
    const queryClient = useQueryClient();
    const {socket} = useSocket();
    const {chatRoomID,selectChatRoom,setSelectedChatRoom,selectedChatRoom} = useChatRoomID();
    const navigate = useNavigate();
    const {data:messages,
            isFetching,
            hasPreviousPage,
            fetchPreviousPage,} = useChatRoomMessageData(chatRoomID && selectedChatRoom.id);
    const {data:profileData} = useMyProfileData();
    const {mutate:saveLastReadMessage} = useSaveLastReadMessage();
    const {mutate:exitChatRoom} = useExitChatRoom();
    const {mutate:kickoutUser} = useKickoutUser();
    const {mutate:changeChatName} = useChatName();
    const {mutate:inviteUsers} = useInviteUsers();
    const {mutate:sendMessage} = useSendMessage();
    const {mutate:sendImageMessage} = useSendImageMessage();
    const textarea = useRef();
    const observer = useRef();
    const chatContainerRef = useRef(null);

    const [text,setText] = useState("");
    const [initScrollTop,setInitScrollTop] = useState(false);
    // const [imgFile,setImgFile] = useState(null);
    const {data:chatRooms, isSuccess} = useChatRoomsData();

    const moveToBottom = () => {
        const chatContainer = chatContainerRef.current;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const handleResizeHeight = (e) => {
        setText(e.target.value);
        textarea.current.style.height = "auto";
        textarea.current.style.height = textarea.current.scrollHeight + "px";
    }

    const addNewMessage = (newMessage) => {
        queryClient.setQueryData(["direct-chatroom-message",selectedChatRoom.id], (oldData)=>(
            {
                ...oldData,
                pages: [
                    ...oldData.pages.slice(0,-1),
                    {
                        ...oldData.pages[oldData.pages.length-1],
                        result: [...oldData.pages[oldData.pages.length-1].result, newMessage],
                    }
                ],
            })
        )
    }

    const updateChatRoomsData = (updatedChatRooms) => {
        saveLastReadMessage(selectedChatRoom.id);
        queryClient.setQueryData(["direct-chatrooms"], (oldData)=>{
            return {
                ...oldData,
                chats: updatedChatRooms
            } 
        })
    }

    const handleExit = async () => {
        const result = window.confirm("Do you want to leave the room?");
        if(result) {
            exitChatRoom(selectedChatRoom.id,{
                onSuccess: (res) => {
                    const updatedChatRoom = chatRooms.filter((chatRoom)=>chatRoom.id !== selectedChatRoom.id);
                    const exitMessage = { chat: { id: selectedChatRoom.id, users: selectedChatRoom.users.filter((user)=>user.nickname !== profileData?.nickname) },
                                        image: false,
                                        content: `${profileData?.nickname} left the room`, 
                                        createdAt: new Date(),
                                        sender: {
                                            system: true,
                                            id: null,
                                            nickname: profileData?.nickname,
                                            imageURL: profileData?.imageURL,
                                        },
                                        id: uuidv4(),
                                        isLoading: true,
                                    };
                    updateChatRoomsData(updatedChatRoom);
                    socket.emit("exit",exitMessage);
                    navigate("/messages/inbox");
                }
            });
        }
    }

    const handleKickout = (kickedUser) => {
        const result = window.confirm(`Do you want kick out ${kickedUser.nickname}`);
        if(result) {
            kickoutUser({kickedUser,chatRoomID:selectedChatRoom.id},{
                onSuccess: (res) => {
                    const kickoutMessage = {chat: { id: selectedChatRoom.id, users: selectedChatRoom.users},
                                            image: false,
                                            content: `${profileData?.nickname} kicked out ${kickedUser.nickname}`, 
                                            createdAt: new Date(),
                                            sender: {
                                                system: true,
                                                id: null,
                                                nickname: profileData?.nickname,
                                                imageURL: profileData?.imageURL,
                                            },
                                            kickedUser,
                                            id: uuidv4(),
                                            isLoading: false};
                    const updatedLastestMessage = {content:kickoutMessage.content,
                                                    createdAt:kickoutMessage.createdAt,
                                                    id:kickoutMessage.id,
                                                    image:kickoutMessage.image}

                    const result = chatRooms.map((chatRoom)=>{
                        if(chatRoom.id === selectedChatRoom.id) {
                            const updatedChatRoom = {...chatRoom,
                                                    latestMessage: updatedLastestMessage,
                                                    users:chatRoom.users.filter((user)=>user.nickname !== kickedUser.nickname),
                                                    leftUsers: chatRoom.leftUsers ? [...chatRoom.leftUsers, kickedUser] : [kickedUser],}
                            setSelectedChatRoom(updatedChatRoom);
                            return updatedChatRoom;
                        } else {
                            return chatRoom
                        }
                    });
                    updateChatRoomsData(result);
                    addNewMessage(kickoutMessage);
                    socket.emit("kickout",kickoutMessage);
                }
            });
        }
    }

    const handleChatName = (e) => {
        setChatName(e.target.value);
    }

    const handleChangeChatName = () => {
        changeChatName({chatRoomID:selectedChatRoom.id,chatName},{
            onSuccess: (res) => {
                if(res.success) {
                    const chatNameMessage = {chat: { id: selectedChatRoom.id, users: selectedChatRoom.users, chatName},
                                            image: false,
                                            content: `${profileData?.nickname} changed chat name to ${chatName}`, 
                                            createdAt: new Date(),
                                            sender: {
                                                system: true,
                                                id: null,
                                                nickname:profileData?.nickname,
                                                imageURL:profileData?.imageURL,
                                            },
                                            id: uuidv4(),
                                            isLoading: false};
                    const updatedLastestMessage = {content:chatNameMessage.content,
                                                createdAt:chatNameMessage.createdAt,
                                                id:chatNameMessage.id,
                                                image:chatNameMessage.image}
                    const result = chatRooms.map((chatRoom)=>{
                        if(chatRoom.id === selectedChatRoom.id) {
                            const updatedChatRoom = {...chatRoom,
                                                    latestMessage:updatedLastestMessage,
                                                    chatName:chatName}
                            setSelectedChatRoom({...selectedChatRoom,chatName});
                            return updatedChatRoom;
                        } else {
                            return chatRoom;
                        }
                    })
                    updateChatRoomsData(result);
                    addNewMessage(chatNameMessage);
                    socket.emit("change chat name", chatNameMessage);

                    setChatName("");
                    setEditChatName(false);
                }
            }
        }) 
    }

    const handleInvitation = (invitedUsers) => {
        inviteUsers({chatRoomID,invitedUsers},{
            onSuccess: (res) => {
                const content = invitedUsers.reduce((prev,cur,index)=>{
                                    if(index===invitedUsers.length-1) return prev + `${cur.nickname}.`
                                    return prev + `${cur.nickname}, `
                                },`${profileData?.nickname} invited `)
                const updatedUsers = [...selectedChatRoom.users, ...invitedUsers];
                const newChatRoom = {
                    ...selectedChatRoom,
                    users: updatedUsers,
                    unReadMessageCount:0, 
                    sender: {
                        nickname: profileData?.nickname,
                        imageURL: profileData?.imageURL,
                        system: true,
                    },
                    receiver: [...invitedUsers]
                };
                socket.emit("new chat room",newChatRoom);

                const invitationMessage = {chat: { id: selectedChatRoom.id, users: updatedUsers},
                                        image: false,
                                        content,
                                        createdAt: new Date(),
                                        sender: {
                                            system: true,
                                            id: null,
                                            nickname:profileData?.nickname,
                                            imageURL: profileData?.imageURL,
                                        },
                                        id: uuidv4(),
                                        isLoading: false};
                const updatedLastestMessage = {content:invitationMessage.content,
                                                createdAt:invitationMessage.createdAt,
                                                id:invitationMessage.id,
                                                image:invitationMessage.image}
                const result = chatRooms.map((chatRoom)=>{
                    if(chatRoom.id === selectedChatRoom.id) {
                        const updatedChatRoom = {...chatRoom,
                                                users:updatedUsers,
                                                latestMessage:updatedLastestMessage}
                        setSelectedChatRoom(updatedChatRoom);
                        return updatedChatRoom;
                    } else {
                        return chatRoom;
                    }
                })
                updateChatRoomsData(result);
                addNewMessage(invitationMessage);
                socket.emit("invite", invitationMessage);
            }
        })
    }

    const sendMsg = async (e) => {
        e.preventDefault();
        if (text.trim() === "") {
            setText("");
            return;
        }
    
        let init = true;
        if (messages.length > 0 && messages[messages.length - 1].sender.nickname === profileData?.nickname) {
            init = false;
        }
    
        const newMessage = {
            chat: { id: selectedChatRoom.id, users: selectedChatRoom.users },
            image: false,
            content: text,
            createdAt: new Date(),
            id: uuidv4(),
            isInit: init,
            sender: {
                nickname:profileData?.nickname,
                imageURL: profileData?.imageURL,
                system: false,
            },
            isLoading: true,
        };
    
        addNewMessage(newMessage);

        sendMessage({content:text,chatRoomID,init}, {
            onSuccess: (res) => {
                newMessage.isLoading = false;
                const updatedLastestMessage = {
                    content: newMessage.content,
                    createdAt: newMessage.createdAt,
                    id: newMessage.id,
                    image: newMessage.image,
                };
                const updatedChatRooms = chatRooms.map((chatRoom) => {
                    if (chatRoom.id === selectedChatRoom.id) return {
                        ...chatRoom,
                        latestMessage: updatedLastestMessage,
                        unReadMessageCount: 0
                    };
                    else return chatRoom;
                });
                updateChatRoomsData(updatedChatRooms);    
                socket.emit("new message", newMessage);
            },
            onError: () => {
                newMessage.isLoading = false;
                newMessage.error = true;
            }
        })
        moveToBottom();
        setText("");
    };



    const handleKeyDown = (e) => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMsg(e);
        }
    }

    const handleChatNameKeyDown = (e) => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChangeChatName();
        }
    }


    const lastElementRef = useCallback((node)=>{
        if(isFetching) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting && hasPreviousPage) {
                fetchPreviousPage();
                if(!initScrollTop) setInitScrollTop(true);
            }
        },{
            threshold: 0.5,
        });
        if(node) observer.current.observe(node);
    },[fetchPreviousPage,isFetching])

    const imageHandler = () => {
        console.log(queryClient.getQueryData(["direct-chatroom-message",selectedChatRoom.id]));
        const input = document.createElement("input");
        input.setAttribute("type","file");
        input.setAttribute("accpet","image/*");
        input.click();
        input.addEventListener("change",()=>{
            const file = input.files[0];
            console.log(input);
            if (file) {
                if (file.type.startsWith("image/")) {
                    const imageFileURL = URL.createObjectURL(file);
                    // setImgFile({ file, imageFileURL });
                    let init = true;
                    if(messages.length > 0 && messages.pop().sender.nickname === profileData?.nickname) {
                        init = false;
                    }
                    const newMessage = {
                        chat: {id:selectedChatRoom.id,users:selectedChatRoom.users},
                        image: true,
                        content: imageFileURL,
                        createdAt: new Date(),
                        id: uuidv4(),
                        isInit: init,
                        sender: {
                            nickname:profileData?.nickname,
                            imageURL: profileData?.imageURL,
                            system:false,
                        },
                        isLoading: true,
                    }
                    const formData = new FormData();
                    formData.append("image",file);
                    formData.append("jsonFile",JSON.stringify({chatRoomID:selectedChatRoom.id,isInit:init}));
                    addNewMessage(newMessage);
                    moveToBottom();

                    sendImageMessage(formData,{
                        onSuccess: (res) => {
                            newMessage.isLoading = false;
                            newMessage.content = res.result.content;
                            const updatedLastestMessage = {content:newMessage.content,
                                createdAt:newMessage.createdAt,
                                id:newMessage.id,
                                image:newMessage.image}
                            const updatedChatRooms = chatRooms.map((chatRoom)=>{
                                if(chatRoom.id === selectedChatRoom.id) return {...chatRoom, 
                                                                    latestMessage:updatedLastestMessage,
                                                                    unReadMessageCount:0}
                                else return chatRoom;
                            })
                            updateChatRoomsData(updatedChatRooms);
                            socket.emit("new message",newMessage);
                        },
                        onError: () => {
                            newMessage.isLoading = false;
                            newMessage.error = true;
                        }
                    })
                } else {
                    alert("Please select an image file.");
                    input.value = "";
                }
            }
        })
    }

    useEffect(()=>{
        if(chatRoomID && isSuccess) {
            const updatedChatRooms = chatRooms.map((chatRoom)=>{
                if(chatRoom.id === selectedChatRoom.id) return {...chatRoom, unReadMessageCount:0}
                else return chatRoom;
            })
            updateChatRoomsData(updatedChatRooms);
        }
    },[chatRoomID,isSuccess,socket])

    useEffect(() => {
        if(messages) localStorage.setItem('currentChatRoom', JSON.stringify(selectedChatRoom));
        if(!initScrollTop) moveToBottom();
    }, [messages]);

    useEffect(() => {
        if(selectedChatRoom && selectedChatRoom.users.length === 1) setEnable(false);
        else setEnable(true);
        setInitScrollTop(null);
    }, [selectedChatRoom]);

    useEffect(() => {
        const roomID = selectedChatRoom && selectedChatRoom.id;
        if(socket) {
            if(chatRoomID === null) selectChatRoom(roomID);
        }

        return (async () => {
            console.log("unmount!");
            if(socket) {
                socket.off("room message received");
            }
        });
    }, [socket]);

    useEffect(()=>{
        if(!chatRoomID) {
            const currentChatRoom = JSON.parse(localStorage.getItem('currentChatRoom'));
            selectChatRoom(currentChatRoom.id);
            setSelectedChatRoom(currentChatRoom);
            console.log(currentChatRoom);
        }
    },[])


    const messageContent = messages && messages.length > 0 &&
                            messages.map((message,index)=>{
                                let displayTime = true;
                                let displayDate = true;
                                if(index !== messages.length-1 &&
                                    message.sender.nickname === messages[index+1].sender.nickname &&
                                    simplifyTimeForMsg(message.createdAt) === simplifyTimeForMsg(messages[index+1].createdAt)) {
                                        displayTime = false;
                                }
                                if(index !== 0 &&
                                    simplifyDateForChatRoom(message.createdAt) === simplifyDateForChatRoom(messages[index-1].createdAt)) {
                                        displayDate = false;
                                }

                                if(index === 0) {
                                    return  message.sender.system ? <SystemMessage key={message.id} ref={lastElementRef} message={message}/> :
                                            message.sender.nickname === profileData?.nickname ? <MyMessage key={message.id} 
                                                                                                ref={lastElementRef} 
                                                                                                message={message} 
                                                                                                displayTime={displayTime}
                                                                                                displayDate={displayDate}
                                                                                                start={message.isInit}/> :
                                                                                    <OpponentMessage key={message.id} 
                                                                                                    ref={lastElementRef} 
                                                                                                    displayTime={displayTime}
                                                                                                    displayDate={displayDate}
                                                                                                    message={message} 
                                                                                                    start={message.isInit}/>
                                } else {
                                    return message.sender.system ? <SystemMessage key={message.id} message={message}/> :
                                    message.sender.nickname === profileData?.nickname ? <MyMessage key={message.id} 
                                                                                        message={message} 
                                                                                        displayTime={displayTime}
                                                                                        displayDate={displayDate}
                                                                                        start={message.isInit}/> :
                                                                            <OpponentMessage key={message.id} 
                                                                                            message={message} 
                                                                                            displayTime={displayTime}
                                                                                            displayDate={displayDate}
                                                                                            start={message.isInit}/>
                                }
                            })

    return (
        <>
            <div className={styles.chatScreen}>
                <div className={styles.titleContainer}>
                    <div className={styles.titleSubContainer}>
                        {!editChatName && selectedChatRoom && <span className={styles.chatTitle}>{selectedChatRoom.isGroupChat ? selectedChatRoom.chatName : 
                                            selectedChatRoom.leftUsers && selectedChatRoom.leftUsers.length > 0 ? selectedChatRoom.leftUsers[0].nickname :
                                            selectedChatRoom.users[0].nickname}</span>}
                        {selectedChatRoom && selectedChatRoom.isGroupChat && profileData?.nickname === selectedChatRoom.groupAdmin && !editChatName &&
                            <AiFillEdit className={styles.editIcon} onClick={()=>{setEditChatName(prev=>!prev)}}/>}
                        {editChatName && 
                        <>
                            <input  className={styles.editChatNameContainer}
                                    value={chatName}
                                    onChange={handleChatName}
                                    onKeyDown={handleChatNameKeyDown}/>
                            <button onClick={handleChangeChatName} className={styles.editBtn}>Edit</button>
                            <button onClick={()=>{setChatName("");setEditChatName(false);}} className={styles.cancelBtn}>Cancel</button>
                        </>}
                    </div>
                    <button className={styles.exitBtn} onClick={handleExit}>
                        <ImExit className={styles.exitIcon}/>
                    </button>
                </div>
                <div className={styles.mainScreen}>
                    <div id="chatContainer" className={styles.conversationScreen} ref={chatContainerRef}>
                        {isFetching &&  
                            <div className={styles.loadingSpinner}><LoadingSpinner/></div>}
                        {messageContent}
                    </div>
                    <form className={styles.msgContainer}>
                            <div className={styles.textContainer}>
                                <textarea className={styles.msgText}
                                        onChange={handleResizeHeight}
                                        value={text}
                                        ref={textarea}
                                        onKeyDown={handleKeyDown}
                                        rows={1} 
                                        disabled={enable ? false : true}
                                        placeholder={enable ? "Message" : "There is no one to talk..."} />
                                <button className={styles.imgBtn} type="button" onClick={imageHandler} disabled={enable ? false : true}> 
                                    <AiOutlinePicture className={styles.imgIcon}/>
                                </button>
                            </div>
                            <button className={styles.sendBtn} onClick={sendMsg} disabled={text === ""? true : false}>Send</button>
                    </form>
                </div>
            </div>
            {selectedChatRoom && <ChatParticipants users={selectedChatRoom.users} 
                                                groupAdmin={selectedChatRoom.groupAdmin} 
                                                handleKickout={handleKickout} 
                                                handleInvitation={handleInvitation}/>}
        </>
    );
}

