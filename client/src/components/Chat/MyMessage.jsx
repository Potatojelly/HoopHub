import React, { forwardRef } from 'react';
import styles from './MyMessage.module.css'
import { simplifyDateForMsg } from '../../date';
import ChatLoadingSpinner from '../Loader/ChatLoadingSpinner';

const MyMessage = ({message, imageLoading, start},ref) => {
    console.log()
    return (
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
                <span className={styles.time}>{simplifyDateForMsg(message.createdAt)}</span>
            </div>
        </div>
    );
}

export default forwardRef(MyMessage);