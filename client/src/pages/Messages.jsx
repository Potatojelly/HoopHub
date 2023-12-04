import React, { useEffect, useState } from 'react';
import ChatRoom from '../components/Chat/ChatRoom';
import styles from './Messages.module.css'
import { Outlet } from 'react-router-dom';
import { getSocketIO, initSocket } from '../network/socket';
import { useMyProfileData } from '../hooks/useMyProfileData';
import { useChatRoomsData } from '../hooks/useChatRoomData';
import LoadingSpinner from '../components/Loader/LoadingSpinner';

let chatSocket;

export default function Messages() {
    const {data:profileData} = useMyProfileData();
    const {data:chatRooms, isFetching, isSuccess} = useChatRoomsData();
    const [socket,setSocket] = useState("");

    useEffect(()=>{
        if(profileData?.nickname) {
            initSocket();
            chatSocket = getSocketIO()
            setSocket(chatSocket);
            chatSocket.emit("setup",profileData?.nickname);
            return () => {
                chatSocket.disconnect();
                setSocket(null);
            }
        }
    },[profileData?.nickname])

    return (
        <div className={styles.container}>
            {socket && <ChatRoom chatRooms={chatRooms} isFetching={isFetching} isSuccess={isSuccess} socket={socket}/>}
            {socket && !chatRooms && <div className={styles.loadingSpinner}><LoadingSpinner/></div>}
            {socket && chatRooms && <Outlet context={[chatRooms,socket]}/>}
        </div>
    );
}

