import React, { useEffect, useState } from 'react';
import styles from './MyProfile.module.css'
import { useProfile } from '../../context/ProfileContext';

export default function MyProfile() {
    const {nickname, imageURL, statusMsg} = useProfile();

    return (
        <li className={styles.myContainer}>
            <div className={styles.mySubContainer}>
                <img src={imageURL ? imageURL : "defaultProfileImg.svg"} alt="myImg"  className={styles.myImg}/>
                <span className={styles.myName}>{nickname}</span>
            </div>
            <p className={styles.myStatus}>{statusMsg}</p>
        </li>
    );
}

