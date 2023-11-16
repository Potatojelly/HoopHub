import React, { useEffect, useState } from 'react';
import styles from './ChatCard.module.css'
import { useChatRoomID } from '../../context/ChatRoomContext';
import {useNavigate} from "react-router-dom";
import { useProfile } from '../../context/ProfileContext';
import {simplifyDate} from '../../date';
import { useSaveLastReadMessage} from '../../hooks/useChatRoomData';
import {FcPicture} from "react-icons/fc";

export default function ChatCard({chatRoom}) {
    const {nickname} = useProfile();
    const [title,setTitle] = useState(null);
    const [opponent,setOpponent] = useState([]);
    const {chatRoomID,selectChatRoom,setSelectedChatRoom} = useChatRoomID();
    const {mutate:saveLastReadMessage} = useSaveLastReadMessage();
    const navigate = useNavigate();
    useEffect(()=>{
        if(chatRoom.chatName === null) {
            if(chatRoom.users.length > 1) {
                chatRoom.users.forEach((user)=>{
                    if(user.nickname !== nickname) {
                        setTitle(user.nickname);
                        setOpponent([{...user}])
                    }
                });
            } else {
                setTitle(chatRoom.leftUsers[0].nickname);
                setOpponent(chatRoom.leftUsers)
            }
        } else {
            setTitle(chatRoom.chatName);
            let opponents = []
            chatRoom.users.forEach((user)=>{
                if(user.nickname !== nickname) {
                    opponents = [...opponents,{...user}];
                }
                setOpponent([...opponents]);
            });
        }
    },[chatRoom])

    const enterChatRoom = () => {
        if(chatRoomID) {
            saveLastReadMessage(chatRoomID);
        }
        selectChatRoom(chatRoom.id); 
        setSelectedChatRoom(chatRoom);
        navigate(`/messages/${title}/${chatRoom.id}`);
    }
    return (
        <div className={`${styles.chatCard} ${(chatRoomID && chatRoomID === chatRoom.id) && styles.selectedChatCard}`} 
            onClick={enterChatRoom}>
            {opponent && opponent.length === 0 && <div className={styles.profileBox}><div className={styles.noParticipants}></div></div>}
            {opponent && opponent.length === 1 && <div className={styles.profileBox}><img src={opponent[0].imageURL} alt="opponentImg"  style={{width:"100%",height:"100%"}}/></div>}
            {opponent && opponent.length === 2 && <div className={styles.profileBox}>{opponent.map((opp,index)=><img key={index} src={opp.imageURL} alt="opponentImg" style={{width:"45%",height:"45%"}}/>)}</div>}
            {opponent && opponent.length === 3 && <div className={styles.profileBox}>{opponent.map((opp,index)=><img key={index}  src={opp.imageURL} alt="opponentImg" style={{width:"45%",height:"45%"}}/>)}</div>}
            {opponent && opponent.length > 4 && <div className={styles.profileBox}>{opponent.map((opp,index)=><img key={index} src={opp.imageURL} alt="opponentImg" style={{width:"45%",height:"45%"}}/>)}</div>}
            <div className={styles.chatContainer}>
                <div className={styles.topLine}>
                    <div className={styles.chatTitle}>{title}</div>
                    <div className={styles.recentTime}>{chatRoom.latestMessage ? simplifyDate(chatRoom.latestMessage.createdAt) : ""}</div>
                </div>
                <div className={styles.bottomLine}>
                    <span className={styles.recentMsg}>{(chatRoom.latestMessage && chatRoom.latestMessage.image) ? <div >Picture: <FcPicture className={styles.pictureImg}/> </div> :
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

