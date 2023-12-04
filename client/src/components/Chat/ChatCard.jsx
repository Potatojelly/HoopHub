import React, { useEffect, useState } from 'react';
import styles from './ChatCard.module.css'
import {useNavigate, useParams} from "react-router-dom";
import {simplifyDate} from '../../date';
import {FcPicture} from "react-icons/fc";
import { useMyProfileData } from '../../hooks/useMyProfileData';

export default function ChatCard({chatRoom}) {
    const navigate = useNavigate();
    const myParam = useParams();
    const chatRoomID = myParam.chatRoomID;
    const [title,setTitle] = useState(null);
    const [opponent,setOpponent] = useState([]);
    const {data: profileData} = useMyProfileData();

    useEffect(()=>{
        if(chatRoom?.chatName === null) {
            if(chatRoom.users.length > 1) {
                chatRoom.users.forEach((user)=>{
                    if(user.nickname !== profileData?.nickname) {
                        setTitle(user.nickname);
                        setOpponent([{...user}])
                    }
                });
            } else {
                if(chatRoom.leftUsers.length > 0) {
                    setTitle(chatRoom.leftUsers[0].nickname);
                    setOpponent(chatRoom.leftUsers)
                }
            }
        } else {
            setTitle(chatRoom.chatName);
            let opponents = []
            chatRoom.users.forEach((user)=>{
                if(user.nickname !== profileData?.nickname) {
                    opponents = [...opponents,{...user}];
                }
                setOpponent([...opponents]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[chatRoom])

    const enterChatRoom = () => {
        navigate(`/messages/${title}/${chatRoom.id}`);
    }

    return (
        <div className={`${styles.chatCard} ${(chatRoomID === chatRoom.id) && styles.selectedChatCard}`} 
            onClick={enterChatRoom}>
            {opponent && opponent.length === 0 && <div className={styles.profileBox}><div className={styles.noParticipants}></div></div>}
            {opponent && opponent.length === 1 && <div className={styles.profileBox}><img src={opponent[0].imageURL} alt="opponentImg"  style={{width:"100%",height:"100%"}}/></div>}
            {opponent && opponent.length === 2 && <div className={styles.profileBox}>{opponent.map((opp,index)=><img key={index} src={opp.imageURL} alt="opponentImg" style={{width:"45%",height:"45%"}}/>)}</div>}
            {opponent && opponent.length === 3 && <div className={styles.profileBox}>{opponent.map((opp,index)=><img key={index}  src={opp.imageURL} alt="opponentImg" style={{width:"45%",height:"45%"}}/>)}</div>}
            {opponent && opponent.length >= 4 && <div className={styles.profileBox}>{opponent.slice(0,4).map((opp,index)=><img key={index} src={opp.imageURL} alt="opponentImg" style={{width:"45%",height:"45%"}}/>)}</div>}
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

