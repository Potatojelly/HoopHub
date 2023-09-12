import React from 'react';
import styles from './Friend.module.css'
import {CgProfile} from "react-icons/cg";

export default function Friend() {
    return (
        <li className={styles.friendContainer}>
            <CgProfile className={styles.friendProfile}/>
            <div className={styles.friendSubContainer}>
                <span className={styles.friendName}>Friend name</span>
                <p className={styles.friendStatus}>Friend Status</p>
            </div>
        </li>
    );
}

