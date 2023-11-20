import React from 'react';
import styles from './ChatInbox.module.css'
import { useChatRoomID } from '../../context/ChatRoomContext';

export default function ChatInbox() {
    const {chatRommID} =useChatRoomID();
    return (
        <>
            {!chatRommID && <div className={styles.startScreen}>
                Start a chat
            </div>}
        </>
    );
}

