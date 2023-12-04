import React, { forwardRef } from 'react';
import styles from './OpponentMessage.module.css'
import {simplifyTimeForMsg } from '../../date';
import DateMessage from './DateMessage';

const OpponentMessage = ({message, displayTime, displayDate, start},ref) => {
    return (
        <>
            {displayDate && <DateMessage date={message.createdAt}/>}
            <div className={`${start && styles.initialmsgLine} ${!start && styles.msgLine}`} ref={ref && ref}>
                {start && 
                <div className={styles.container}>  
                    <img src={message.sender.user?.imageURL} alt="opponentProfileImg"  className={styles.profileImg}/>
                    <div className={styles.subContainer}>
                        <div className={styles.name}>{message.sender.user?.nickname}</div>
                        <div className={styles.msgContainer}>
                            <div className={styles.initialSpeechBubble}>
                                {message.image ? 
                                    <img className={styles.imageFile} src={message.content} alt="imageFile"/> : 
                                    <div className={styles.content}>{message.content}</div>}
                            </div>
                            <div className={styles.info}>
                                {displayTime && <span className={styles.time}>{simplifyTimeForMsg(message.createdAt)}</span>}
                            </div>
                        </div>
                    </div>
                </div>}
                {!start &&
                <>
                    <div className={styles.speechBubble}>
                    {message.image ? 
                        <img className={styles.imageFile} src={message.content} alt="imageFile"/> : 
                        <div>{message.content}</div>}
                    </div>
                    <div className={styles.info}>
                        {displayTime && <span className={styles.time}>{simplifyTimeForMsg(message.createdAt)}</span>}
                    </div>
                </>
                }
            </div>
        </>
    );
}

export default forwardRef(OpponentMessage);