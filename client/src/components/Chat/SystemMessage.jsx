import React, { forwardRef } from 'react';
import styles from './SystemMessage.module.css'
import { simplifyDateForChatRoom } from '../../date';

const SystemMessage = ({message},ref) => {
    return (
        <div className={styles.msgLine} ref={ref && ref}>
            {message.content === null ?
            <div className={styles.date}>
                <span>
                    {simplifyDateForChatRoom(message.createdAt)}
                </span>
            </div>
            :
            <div>
                {message.content}
            </div>
            }
        </div>
    );
}

export default forwardRef(SystemMessage);