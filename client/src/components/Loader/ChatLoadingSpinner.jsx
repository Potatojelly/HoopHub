import React from 'react';
import styles from './ChatLoadingSpinner.module.css'

export default function ChatLoadingSpinner() {
    return (
        <div className={styles.container}>
            <div className={styles.ldsRing}><div></div><div></div><div></div><div></div></div>
        </div>
    );
}

