import React from 'react';
import styles from './DateMessage.module.css'
import { simplifyDateForChatRoom } from '../../date';

export default function DateMessage({date}) {
    return (
        <div className={styles.msgLine}>
            <div className={styles.date}>
                <span>
                    {simplifyDateForChatRoom(date)}
                </span>
            </div>
        </div>
    );
}

