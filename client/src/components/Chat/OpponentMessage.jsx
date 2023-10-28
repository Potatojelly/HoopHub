import React, { forwardRef } from 'react';
import styles from './OpponentMessage.module.css'
import { simplifyDateForMsg } from '../../date';

const OpponentMessage = ({message, start},ref) => {
    return (
        <div className={`${start && styles.initialmsgLine} ${!start && styles.msgLine}`} ref={ref && ref}>
            {start && 
            <div className={styles.container}>  
                <img src={message.sender.imageURL} alt="opponentProfileImg"  className={styles.profileImg}/>
                <div className={styles.subContainer}>
                    <div className={styles.name}>{message.sender.nickname}</div>
                    <div className={styles.initialSpeechBubble}>
                        {message.image ? <img src={message.content}/> : 
                                    <div>{message.content}</div>}
                    </div>
                </div>
            </div>}
            {!start &&
            <div className={styles.speechBubble}>
                {message.image ? <img src={message.content}/> : 
                <div>{message.content}</div>}
            </div>}
            <div className={styles.info}>
                <span className={styles.time}>{simplifyDateForMsg(message.createdAt)}</span>
            </div>
        </div>
    );
}

export default forwardRef(OpponentMessage);