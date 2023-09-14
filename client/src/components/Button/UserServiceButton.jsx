import React from 'react';
import styles from './UserServiceButton.module.css'

export default function UserServiceButton({text, onClick}) {
    return (
        <button className={styles.button} onClick={onClick}>
            {text}
        </button>
    );
}

