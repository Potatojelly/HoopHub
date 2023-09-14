import React from 'react';
import styles from './UserServiceButton.module.css'
import {GiExitDoor} from "react-icons/gi";
export default function UserServiceButton({text, onClick}) {
    return (
        <button className={styles.button} onClick={onClick}>
            {text==="Logout" && <GiExitDoor className={styles.exitIcon}/>}
            {text}
        </button>
    );
}

