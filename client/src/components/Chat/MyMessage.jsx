import React, { forwardRef } from 'react';
import styles from './MyMessage.module.css'
import { simplifyTimeForMsg } from '../../date';
import ChatLoadingSpinner from '../Loader/ChatLoadingSpinner';
import DateMessage from './DateMessage';

const MyMessage = ({message, displayTime, displayDate, start},ref) => {
    return (
        <>
            {displayDate && <DateMessage date={message.createdAt}/>}
            <div className={styles.msgLine} ref={ref && ref}>
                {start && 
                <div className={styles.initialSpeechBubble}>
                    {message.image && message.isLoading ? <ChatLoadingSpinner className={styles.uploadingSpinner}/>:""}
                    {message.image ? 
                        <img className={styles.imageFile} src={message.content}/> :
                        <div>{message.content}</div>}
                </div>}
                {!start &&
                <div className={styles.speechBubble}>
                    {message.image && message.isLoading ? <ChatLoadingSpinner className={styles.uploadingSpinner}/>:""}
                    {message.image ? 
                        <img className={styles.imageFile} src={message.content}/> :
                        <div>{message.content}</div>}
                </div>}
                <div className={styles.info}>
                    {message.error && <span className={styles.errorMsg}>Failed to send</span>}
                    {displayTime && <span className={styles.time}>{simplifyTimeForMsg(message.createdAt)}</span>}
                </div>
            </div>
        </>
    );
}

export default forwardRef(MyMessage);