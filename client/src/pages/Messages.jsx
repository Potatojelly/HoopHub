import React, { useEffect } from 'react';
import ChatRoom from '../components/Chat/ChatRoom';
import styles from './Messages.module.css'
import { Outlet } from 'react-router-dom';
import { getSocketIO, initSocket } from '../network/socket';
import {useSocket} from "../context/SocketContext"
import { useMyProfileData } from '../hooks/useMyProfileData';


export default function Messages() {
    const {setSocket} = useSocket();
    const {data:profileData} = useMyProfileData();
    let chatSocket;
    useEffect(()=>{
        if(profileData?.nickname) {
            initSocket();
            chatSocket = getSocketIO();
            chatSocket.emit("setup",profileData?.nickname);
            chatSocket.on("connected",()=>{
                setSocket(chatSocket);
            })
            return () => {
                console.log("chat unmount");
                chatSocket.disconnect();
                setSocket(null);
            }
        }
    },[profileData?.nickname])

    return (
        <div className={styles.container}>
            <ChatRoom/>
            <Outlet/>
        </div>
    );
}

