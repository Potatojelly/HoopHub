import React from 'react';
import styles from './MyProfile.module.css'
import {CgProfile} from "react-icons/cg";

export default function MyProfile() {
    return (
        <li className={styles.myContainer}>
            <div className={styles.mySubContainer}>
                <CgProfile className={styles.myProfile}/>
                <span className={styles.myName}>My name</span>
            </div>
            <p className={styles.myStatus}>My Status</p>
        </li>
    );
}

