import React, { useEffect } from 'react';
import ChatRoom from '../components/Chat/ChatRoom';
import styles from './Messages.module.css'
import { Outlet } from 'react-router-dom';
import { getSocketIO, initSocket } from '../network/socket';
import {useSocket} from "../context/SocketContext"
import { useProfile } from '../context/ProfileContext';


export default function Messages({chatService}) {
    let chatSocket;
    const {setSocket} = useSocket();
    const {nickname} = useProfile();
    useEffect(()=>{
        if(nickname) {
            initSocket();
            chatSocket = getSocketIO();
            chatSocket.emit("setup",nickname);
            chatSocket.on("connected",()=>{
                setSocket(chatSocket);
            })
            return () => {
                console.log("chat unmount");
                chatSocket.disconnect();
                setSocket(null);
            }
        }
    },[nickname])

    return (
        <div className={styles.container}>
            <ChatRoom chatService={chatService}/>
            <Outlet/>
        </div>
    );
}

