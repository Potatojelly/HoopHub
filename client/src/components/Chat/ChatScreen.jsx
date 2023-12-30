import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ChatScreen.module.css';
import {AiOutlinePicture} from "react-icons/ai";
import {ImExit} from "react-icons/im";
import MyMessage from './MyMessage';
import OpponentMessage from './OpponentMessage';
import ChatParticipants from './ChatParticipants';
import {useChatName, useChatRoomMessageData, useExitChatRoom, useInviteUsers, useKickoutUser, useSaveLastReadMessage, useSendImageMessage} from '../../hooks/useChatRoomData';
import {useQueryClient} from '@tanstack/react-query';
import {v4 as uuidv4} from "uuid";
import SystemMessage from './SystemMessage';
import {useNavigate} from "react-router-dom";
import { simplifyDateForChatRoom, simplifyTimeForMsg } from '../../date';
import {AiFillEdit} from "react-icons/ai";
import { useMyProfileData } from '../../hooks/useMyProfileData';
import { useParams,useOutletContext } from 'react-router-dom';
import SmallLoadingSpinner from '../Loader/SmallLoadingSpinner';

export default function ChatScreen({chatService}) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const myParam = useParams();
    const chatRoomID = myParam.chatRoomID;
    const textarea = useRef();
    const observer = useRef();
    const messageEndRef = useRef(null);
    const bottomObserver = useRef();
    const [isInit,setIsInit] = useState(true);
    const [isScrollBottom,setIsScrollBottom] = useState(false);
    const [text,setText] = useState("");
    const [enable,setEnable] = useState(true);
    const [editChatName,setEditChatName] = useState(false);
    const [chatName,setChatName] = useState("");
    const [chatRooms,socket] = useOutletContext();
    const {data:messages,
            isFetching,
            hasPreviousPage,
            fetchPreviousPage,} = useChatRoomMessageData(chatRoomID);
    const {data:profileData} = useMyProfileData();
    const {mutate:saveLastReadMessage} = useSaveLastReadMessage();
    const {mutate:exitChatRoom} = useExitChatRoom();
    const {mutate:kickoutUser} = useKickoutUser();
    const {mutate:changeChatName} = useChatName();
    const {mutate:inviteUsers} = useInviteUsers();
    const {mutate:sendImageMessage} = useSendImageMessage();
    const [selectedChatRoom,setSelectedChatRoom] = useState(chatRooms.find((chatRoom)=>chatRoom.id===chatRoomID));
    useEffect(()=>{setSelectedChatRoom(chatRooms.find((chatRoom)=>chatRoom.id===chatRoomID))},[chatRoomID,chatRooms])

    const moveScrollToBottom = () => {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const handleResizeHeight = (e) => {
        setText(e.target.value);
        textarea.current.style.height = "auto";
        textarea.current.style.height = textarea.current.scrollHeight + "px";
    }

    const addNewMessage = (newMessage) => {
        queryClient.setQueryData(["direct-chatroom-message",chatRoomID], (oldData)=>{
        
            return {
                ...oldData,
                pages: [
                    ...oldData.pages.slice(0,-1),
                    {
                        ...oldData.pages[oldData.pages.length-1],
                        result: [...oldData.pages[oldData.pages.length-1].result, newMessage],
                    }
                ],
            }
    
        })
    }

    const updateChatRoomsData = (updatedChatRooms) => {
        saveLastReadMessage(chatRoomID);
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
            exitChatRoom(chatRoomID,{
                onSuccess: (res) => {
                    const updatedChatRoom = chatRooms.filter((chatRoom)=>chatRoom.id !== chatRoomID);
                    const exitMessage = { chat: { id: chatRoomID, users: selectedChatRoom.users.filter((user)=>user.nickname !== profileData?.nickname) },
                                        image: false,
                                        content: `${profileData?.nickname} left the room`, 
                                        createdAt: new Date(),
                                        sender: {
                                            system: true,
                                            user: {nickname: profileData?.nickname,imageURL: profileData?.imageURL}
                                        },
                                        id: uuidv4(),
                                        isLoading: true,
                                        realTime: true
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
            kickoutUser({kickedUser,chatRoomID},{
                onSuccess: (res) => {
                    const kickoutMessage = {chat: { id: chatRoomID, users: selectedChatRoom.users},
                                            image: false,
                                            content: `${profileData?.nickname} kicked out ${kickedUser.nickname}`, 
                                            createdAt: new Date(),
                                            sender: {
                                                system: true,
                                                user: {nickname: profileData?.nickname,imageURL: profileData?.imageURL}
                                            },
                                            kickedUser,
                                            id: uuidv4(),
                                            isLoading: false,
                                            realTime: true};
                    const updatedLastestMessage = {content:kickoutMessage.content,
                                                    createdAt:kickoutMessage.createdAt,
                                                    id:kickoutMessage.id,
                                                    image:kickoutMessage.image}

                    const result = chatRooms.map((chatRoom)=>{
                        if(chatRoom.id === chatRoomID) {
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
        changeChatName({chatRoomID,chatName},{
            onSuccess: (res) => {
                if(res.success) {
                    const chatNameMessage = {chat: { id: chatRoomID, users: selectedChatRoom.users, chatName},
                                            image: false,
                                            content: `${profileData?.nickname} changed chat name to ${chatName}`, 
                                            createdAt: new Date(),
                                            sender: {
                                                system: true,
                                                user: {nickname: profileData?.nickname,imageURL: profileData?.imageURL}
                                            },
                                            id: uuidv4(),
                                            isLoading: false,
                                            realTime: true};
                    const updatedLastestMessage = {content:chatNameMessage.content,
                                                createdAt:chatNameMessage.createdAt,
                                                id:chatNameMessage.id,
                                                image:chatNameMessage.image}
                    const result = chatRooms.map((chatRoom)=>{
                        if(chatRoom.id === chatRoomID) {
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
                        user: {nickname: profileData?.nickname,imageURL: profileData?.imageURL},
                        system: true,
                    },
                    receiver: [...invitedUsers]
                };
                socket.emit("new chat room",newChatRoom);

                const invitationMessage = {chat: { id: chatRoomID, users: updatedUsers},
                                        image: false,
                                        content,
                                        createdAt: new Date(),
                                        sender: {
                                            system: true,
                                            user: {nickname: profileData?.nickname,imageURL: profileData?.imageURL},
                                        },
                                        id: uuidv4(),
                                        isLoading: false,
                                        realTime: true,};
                const updatedLastestMessage = {content:invitationMessage.content,
                                                createdAt:invitationMessage.createdAt,
                                                id:invitationMessage.id,
                                                image:invitationMessage.image}
                const result = chatRooms.map((chatRoom)=>{
                    if(chatRoom.id === chatRoomID) {
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

        if (messages.length > 0 && messages[messages.length - 1].sender.user?.nickname === profileData?.nickname) {
            init = false;
        }
    
        const newMessage = {
            chat: { id: chatRoomID, users: selectedChatRoom.users },
            image: false,
            content: text,
            createdAt: new Date(),
            id: uuidv4(),
            isInit: init,
            sender: {
                user:{nickname:profileData?.nickname,imageURL: profileData?.imageURL,},
                system: false,
            },
            isLoading: true,
            realTime: true,
        };
    
        addNewMessage(newMessage);

        chatService.sendMessage(text,chatRoomID,init)
            .then((res)=>{
                if(res){
                    newMessage.isLoading = false;
                    const updatedLastestMessage = {
                        content: newMessage.content,
                        createdAt: newMessage.createdAt,
                        id: newMessage.id,
                        image: newMessage.image,
                    };
                    const updatedChatRooms = chatRooms.map((chatRoom) => {
                        if (chatRoom.id === chatRoomID) return {
                            ...chatRoom,
                            latestMessage: updatedLastestMessage,
                            unReadMessageCount: 0
                        };
                        else return chatRoom;
                    });
                    updateChatRoomsData(updatedChatRooms);    
                    socket.emit("new message", newMessage);
                }
            }).catch(() => {
                newMessage.isLoading = false;
                newMessage.error = true;
            })

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

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type","file");
        input.setAttribute("accpet","image/*");
        input.click();
        input.addEventListener("change",()=>{
            const file = input.files[0];
            if (file) {
                if (file.type.startsWith("image/")) {
                    const imageFileURL = URL.createObjectURL(file);
                    let init = true;
                    if(messages.length > 0 && messages.pop().sender.nickname === profileData?.nickname) {
                        init = false;
                    }
                    const newMessage = {
                        chat: {id:chatRoomID,users:selectedChatRoom.users},
                        image: true,
                        content: imageFileURL,
                        createdAt: new Date(),
                        id: uuidv4(),
                        isInit: init,
                        sender: {
                            user:{nickname:profileData?.nickname,imageURL: profileData?.imageURL,},
                            system:false,
                        },
                        isLoading: true,
                        realTime: true,
                    }
                    const formData = new FormData();
                    formData.append("image",file);
                    formData.append("jsonFile",JSON.stringify({isInit:init}));
                    addNewMessage(newMessage);

                    sendImageMessage({formData,chatRoomID},{
                        onSuccess: (res) => {
                            newMessage.isLoading = false;
                            newMessage.content = res.result.content;
                            const updatedLastestMessage = {content:newMessage.content,
                                createdAt:newMessage.createdAt,
                                id:newMessage.id,
                                image:newMessage.image}
                            const updatedChatRooms = chatRooms.map((chatRoom)=>{
                                if(chatRoom.id === chatRoomID) return {...chatRoom, 
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

    const lastElementRef = useCallback((node)=>{
        if(isFetching) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting && hasPreviousPage && !isInit) {
                fetchPreviousPage();
            }
        },{
            threshold: 0.5,
        });
        if(node) observer.current.observe(node);
    },[fetchPreviousPage,isFetching,isInit,hasPreviousPage])

    const bottomRef= useCallback((node)=>{
        bottomObserver.current = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting) {
                setIsScrollBottom(true);
            } else if(!entries[0].isIntersecting) {
                setIsScrollBottom(false);
            }
        });
        if(node) bottomObserver.current.observe(node);
    },[])

    useEffect(()=>{
        if(chatRoomID) {
            setIsInit(true);
            setIsScrollBottom(false);
            const updatedChatRooms = chatRooms.map((chatRoom)=>{
                if(chatRoom.id === chatRoomID) return {...chatRoom, unReadMessageCount:0}
                else return chatRoom;
            })
            updateChatRoomsData(updatedChatRooms);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[chatRoomID])

    useEffect(() => {
        if(messages) {
            if(isInit && !isScrollBottom) {moveScrollToBottom(); return}; 
            if(isInit && isScrollBottom) {setIsInit(false); return;}
            if(messages[messages?.length-1].realTime && (messages[messages?.length-1]?.sender?.nickname === profileData.nickname ||
                messages[messages?.length-1]?.sender?.nickname !== profileData.nickname && isScrollBottom)) {
                moveScrollToBottom();
            }
        }
    }, [messages,isInit,isScrollBottom,profileData.nickname]);


    useEffect(() => {
        if(selectedChatRoom && selectedChatRoom.users.length === 1) setEnable(false);
        else setEnable(true);
    }, [selectedChatRoom]);

    useEffect(()=>{
        return ()=>{queryClient.removeQueries(["direct-chatroom-message"])}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const messageContent = messages && messages.length > 0 &&
                            messages.map((message,index)=>{
                                let displayTime = true;
                                let displayDate = true;
                                if(index !== messages.length-1 &&
                                    // message.sender.nickname === messages[index+1].sender.nickname &&
                                    message.sender.user?.nickname === messages[index+1].sender.user?.nickname &&
                                    simplifyTimeForMsg(message.createdAt) === simplifyTimeForMsg(messages[index+1].createdAt)) {
                                        displayTime = false;
                                }
                                if(index !== 0 &&
                                    simplifyDateForChatRoom(message.createdAt) === simplifyDateForChatRoom(messages[index-1].createdAt)) {
                                        displayDate = false;
                                }

                                if(index === 0) {
                                    return  message.sender.system ? <SystemMessage key={message.id} ref={isInit ? undefined : lastElementRef} message={message}/> :
                                            message.sender.user?.nickname === profileData?.nickname ? <MyMessage key={message.id} 
                                                                                                ref={isInit ? undefined : lastElementRef}
                                                                                                message={message} 
                                                                                                displayTime={displayTime}
                                                                                                displayDate={displayDate}
                                                                                                start={message.isInit}/> :
                                                                                    <OpponentMessage key={message.id} 
                                                                                                    ref={isInit ? undefined : lastElementRef}
                                                                                                    displayTime={displayTime}
                                                                                                    displayDate={displayDate}
                                                                                                    message={message} 
                                                                                                    start={message.isInit}/>
                                } else {
                                    return message.sender.system ? <SystemMessage key={message.id} message={message}/> :
                                    message.sender.user?.nickname === profileData?.nickname ? <MyMessage key={message.id} 
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
                    <div id="chatContainer" className={styles.conversationScreen}>
                        {isFetching &&  
                            <div className={styles.loadingSpinner}><SmallLoadingSpinner/></div>}
                        {messageContent}
                        {messages && <div ref={bottomRef}><div ref={messageEndRef} className={styles.messageEndRef}></div></div>}
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

