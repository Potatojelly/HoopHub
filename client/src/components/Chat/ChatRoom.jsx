import React, { useEffect, useState } from 'react';
import styles from './ChatRoom.module.css'
import {TbMessageCirclePlus} from "react-icons/tb"
import ChatCard from './ChatCard';
import {useChatRoomID } from '../../context/ChatRoomContext';
import {useChatRooms} from '../../hooks/useChatRoomData';
import { useUserSearch } from '../../context/UserSearchContext';
import {useNavigate} from "react-router-dom";

export default function ChatRoom({chatService}) {
    const [chatRooms,setChatRooms] = useState();
    const {selectChatRoom} = useChatRoomID();
    const {setUserSearch} = useUserSearch();
    const {data} = useChatRooms();
    const navigate = useNavigate();
    // const sortedChatRooms = [...chatRooms].sort((a, b) => {
    //     return new Date(b.createdAt) - new Date(a.createdAt);
    //   });
    // chatRooms && console.log(chatRooms);
    
    useEffect(()=>{
        setChatRooms(data);
    },[data]) 

    const updateUnreadMessage = (chatRoomID) => {
        const updatedChatRooms = chatRooms.map((chatRoom)=>{
            if(chatRoom.id === chatRoomID) return {...chatRoom, unReadMessageCount:0}
            else return chatRoom;
        })
        setChatRooms(updatedChatRooms);
    }

    const searchUser = () => {
        setUserSearch(true); 
        selectChatRoom(null);
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
                <ul className={styles.directMsgList}>
                    <div className={styles.listTitle}>Direct Chats</div>
                    {chatRooms && chatRooms.map((chatRoom)=><ChatCard key={chatRoom.id} 
                                                                    updateUnreadMessage={updateUnreadMessage}
                                                                    chatRoom={chatRoom} 
                                                                    chatService={chatService}/>)}
                </ul>
            </div>
        </div>
    );
}

