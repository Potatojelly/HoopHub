import React from 'react';
import styles from './Alarm.module.css'
import {IoIosBasketball} from "react-icons/io";

export default function Alarm({message,upload,progress}) {
    return (
        <div className={styles.msgContainer}>
            <IoIosBasketball className={styles.logo}/>
            <div className={styles.msg}>
                <div>{message}</div>
                {upload && <div>Please, do not leave the page</div>}
                {upload && progress && 
                <div className={styles.progressContainer}>
                    <progress className={styles.progressBar} value={progress} max="100"></progress>
                    <span className={styles.progressText}>{progress}%</span>
                </div>}
            </div>
        </div>
    );
}

