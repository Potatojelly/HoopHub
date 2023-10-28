import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ChatScreen.module.css';
import {AiOutlinePicture} from "react-icons/ai";
import {ImExit} from "react-icons/im";
import MyMessage from './MyMessage';
import OpponentMessage from './OpponentMessage';
import ChatParticipants from './ChatParticipants';
import { useChatRoomMessage, useLastReadMessage, useSaveLastReadMessage, useSendImageMessage, useSendMessage, useUpdateChatRoomMessage } from '../../hooks/useChatRoomData';
import {useQuery,useInfiniteQuery,useQueryClient} from '@tanstack/react-query';
import { useProfile } from '../../context/ProfileContext';
import {v4 as uuidv4} from "uuid";
import SystemMessage from './SystemMessage';
import { useChatRoomID } from '../../context/ChatRoomContext';
import {useLocation} from "react-router-dom";
import LoadingSpinner from '../Loader/LoadingSpinner';

export default function ChatScreen({chatService}) {
    const queryClient = useQueryClient();
    const {state:chat} = useLocation();
    const {data:messages,
            isFetching,
            hasPreviousPage,
            fetchPreviousPage} = useChatRoomMessage(chat.id);
    const {nickname} = useProfile();
    const {mutate:sendMessage} = useSendMessage();
    const {mutate:sendImageMessage} = useSendImageMessage();
    const {mutate:saveLastReadMessage} = useSaveLastReadMessage();
    const textarea = useRef();
    const observer = useRef();
    const chatContainerRef = useRef(null);

    const [text,setText] = useState("");
    const {chatRoomID,selectChatRoom} = useChatRoomID();
    const [initScrollTop,setInitScrollTop] = useState(false);
    const [imgFile,setImgFile] = useState(null);

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
        queryClient.setQueryData(["direct-chatroom-message",chatRoomID], (oldData)=>(
            {
                ...oldData,
                pages: [
                    ...oldData.pages.slice(0,-1),
                    {
                        ...oldData.pages[oldData.pages.length-1],
                        result: [...oldData.pages[oldData.pages.length-1].result, newMessage],
                    }
                ],
            }
        ));
    }

    const updateNewMessage = (newMessage) => {
        queryClient.setQueryData(["direct-chatroom-message",chatRoomID], (oldData)=>(
            {
                ...oldData,
                pages: [
                    ...oldData.pages.slice(0,-1),
                    {
                        ...oldData.pages[oldData.pages.length-1],
                        result: [...oldData.pages[oldData.pages.length-1].result.slice(0,-1), newMessage],
                    }
                ],
            }
        ));
    }

    const sendMsg = (e) => {
        e.preventDefault();
        if(text.trim()==="") {
            setText("");
            return;
        }

        let init = true;
        if(messages.length > 0 && messages.pop().sender.nickname === nickname) {
            init = false;
        }
        const newMessage = {
            chat: chat.id,
            image: false,
            content: text,
            createdAt: new Date(),
            id: uuidv4(),
            isInit: init,
            sender: {
                nickname,
                system:false,
            },
        }
        addNewMessage(newMessage);
        //sendMessage({chatRoomID:chat.id,content:text,init});
        moveToBottom();
        setText("");
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMsg(e);
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
        console.log(queryClient.getQueryData(["direct-chatroom-message",chat.id]));
        const input = document.createElement("input");
        input.setAttribute("type","file");
        input.setAttribute("accpet","image/*");
        input.click();
        input.addEventListener("change",()=>{
            const file = input.files[0];
            console.log(input);
            if (file) {
                if (file.type.startsWith("image/")) {
                    const imageURL = URL.createObjectURL(file);
                    setImgFile({ file, imageURL });
                    let init = true;
                    if(messages.length > 0 && messages.pop().sender.nickname === nickname) {
                        init = false;
                    }
                    const newMessage = {
                        chat: chat.id,
                        image: true,
                        content: imageURL,
                        createdAt: new Date(),
                        id: uuidv4(),
                        isInit: init,
                        sender: {
                            nickname,
                            system:false,
                        },
                        isLoading: true,
                    }
                    const formData = new FormData();
                    formData.append("image",file);
                    formData.append("jsonFile",JSON.stringify({chatRoomID:chat.id,isInit:init}));
                    addNewMessage(newMessage);
                    moveToBottom();
                    sendImageMessage(formData,{
                        onSuccess:(res)=>{
                            newMessage.isLoading = false;
                            updateNewMessage(newMessage);
                        },
                        onError: (err) => {
                            newMessage.isLoading = false;
                            newMessage.error = true;
                            updateNewMessage(newMessage);
                        }   
                    });
                } else {
                    alert("Please select an image file.");
                    input.value = "";
                }
            }
        })
    }

    useEffect(() => {
        if(!initScrollTop) moveToBottom();
    }, [messages]);

    useEffect(() => {
        setInitScrollTop(null);
    }, [chat]);

    useEffect(() => {
        const roomID = chat.id;
        if(chatRoomID === null) selectChatRoom(roomID);
        return () => {
            saveLastReadMessage(roomID);
        };
    }, []);

    const messageContent = messages && messages.length > 0 &&
                            messages.map((message,index)=>{
                                if(index === 0) {
                                    return  message.sender.system ? <SystemMessage key={message.id} ref={lastElementRef} message={message}/> :
                                            message.sender.nickname === nickname ? <MyMessage key={message.id} 
                                                                                                ref={lastElementRef} 
                                                                                                message={message} 
                                                                                                start={message.isInit}/> :
                                                                                    <OpponentMessage key={message.id} 
                                                                                                    ref={lastElementRef} 
                                                                                                    message={message} 
                                                                                                    start={message.isInit}/>
                                } else {
                                    return message.sender.system ? <SystemMessage key={message.id} message={message}/> :
                                    message.sender.nickname === nickname ? <MyMessage key={message.id} 
                                                                                        message={message} 
                                                                                        start={message.isInit}/> :
                                                                            <OpponentMessage key={message.id} 
                                                                                            message={message} 
                                                                                            start={message.isInit}/>
                                }
                            })
    return (
        <>
            <div className={styles.chatScreen}>
                <div className={styles.titleContainer}>
                    <span className={styles.chatTitle}>Title</span>
                    <button className={styles.exitBtn}>
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
                                        placeholder="Message" />
                                <button className={styles.imgBtn} type="button" onClick={imageHandler}>
                                    <AiOutlinePicture className={styles.imgIcon}/>
                                </button>
                            </div>
                            <button className={styles.sendBtn} onClick={sendMsg} disabled={text === ""? true : false}>Send</button>
                    </form>
                </div>
            </div>
            <ChatParticipants users={chat.users}/>
        </>
    );
}

