import React, { useEffect, useState } from 'react';
import styles from './ChatCard.module.css'
import { useChatRoomID } from '../../context/ChatRoomContext';
import {useNavigate} from "react-router-dom";
import { useProfile } from '../../context/ProfileContext';
import { useUserSearch } from '../../context/UserSearchContext';
import {simplifyDate} from '../../date';
import { useSaveLastReadMessage, useUnreadMessageNumber } from '../../hooks/useChatRoomData';
import {FcPicture} from "react-icons/fc";

export default function ChatCard({chatRoom,updateUnreadMessage,chatService}) {
    const {nickname} = useProfile();
    const [title,setTitle] = useState(null);
    const [opponent,setOpponent] = useState(null);
    const {chatRoomID,selectChatRoom} = useChatRoomID();
    const {mutate:saveLastReadMessage} = useSaveLastReadMessage();
    const navigate = useNavigate();
    useEffect(()=>{

        chatRoom.users.forEach((user)=>{
            if(user.nickname !== nickname) {
                setTitle(user.nickname);
                setOpponent({...user})
            }
        });

    },[])

    const enterChatRoom = () => {
        if(chatRoomID) {
            console.log("Update",chatRoomID);
            saveLastReadMessage(chatRoomID);
        }
        selectChatRoom(chatRoom.id); 
        updateUnreadMessage(chatRoom.id);
        // setUserSearch(false); 
        // setUnreadMessageCounter(0);
        navigate(`/messages/${title}`, {state: chatRoom});
    }
    return (
        <div className={`${styles.chatCard} ${(chatRoomID && chatRoomID === chatRoom.id) && styles.selectedChatCard}`} 
            onClick={enterChatRoom}>
            <img src={opponent && opponent.imageURL} alt="opponentImg"  className={styles.chatImg}/>
            <div className={styles.chatContainer}>
                <div className={styles.topLine}>
                    <div className={styles.chatTitle}>{title}</div>
                    <div className={styles.recentTime}>{chatRoom.latestMessage ? simplifyDate(chatRoom.latestMessage.createdAt) : ""}</div>
                </div>
                <div className={styles.bottomLine}>
                    <span className={styles.recentMsg}>{chatRoom.latestMessage.image ? <div >Picture: <FcPicture className={styles.pictureImg}/> </div> :
                                                                        chatRoom.latestMessage ? chatRoom.latestMessage.content : ""}
                    </span>
                    {chatRoom.unReadMessageCount !== 0 &&
                    <div className={styles.unreadMessageCounter}>
                        <span className={styles.countNumber}>{chatRoom.unReadMessageCount}</span>
                    </div>}
                </div>
            </div>
        </div>
    );
}

