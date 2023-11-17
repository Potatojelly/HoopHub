import React from 'react';
import styles from './Alarm.module.css'
import {IoIosBasketball} from "react-icons/io";

export default function Alarm({message}) {
    return (
        <div className={styles.msgContainer}>
            <IoIosBasketball className={styles.logo}/>
            <div className={styles.msg}>
                <span>{message}</span>
            </div>
        </div>
    );
}

