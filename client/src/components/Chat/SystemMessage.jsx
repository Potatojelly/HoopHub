import React, { forwardRef } from 'react';
import styles from './SystemMessage.module.css'

const SystemMessage = ({message},ref) => {
    return (
        <div className={styles.msgLine} ref={ref && ref}>
            <div>
                {message.content}
            </div>
        </div>
    );
}

export default forwardRef(SystemMessage);