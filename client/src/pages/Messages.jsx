import React, { useEffect, useState } from 'react';
import ChatRoom from '../components/Chat/ChatRoom';
import styles from './Messages.module.css'
import ChatScreen from '../components/Chat/ChatScreen';
import ChatParticipants from '../components/Chat/ChatParticipants';
import { useChatRoom, useChatRoomID } from '../context/ChatRoomContext';
import UserSearch from '../components/Chat/UserSearch';
import { useLocation, Route, Routes, BrowserRouter,Outlet } from 'react-router-dom';
import { useUserSearch } from '../context/UserSearchContext';

export default function Messages({searchService, chatService}) {
    const {chatRoomID,selectChatRoom} = useChatRoomID();
    return (
        <div className={styles.container}>
            <ChatRoom chatService={chatService}/>
            <Outlet/>
        </div>
    );
}

