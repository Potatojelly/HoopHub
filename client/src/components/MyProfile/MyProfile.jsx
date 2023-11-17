import React, { useEffect, useState } from 'react';
import styles from './MyProfile.module.css'
import { useProfile } from '../../context/ProfileContext';
import { useMyProfileData } from '../../hooks/useMyProfileData';

export default function MyProfile() {
    const {nickname, imageURL, statusMsg} = useProfile();
    const {data: profileData,isFetching,isError} = useMyProfileData();
    return (
        <>
            {profileData && 
            <li className={styles.myContainer}>
                <div className={styles.mySubContainer}>
                    <img src={profileData.imageURL} alt="myImg"  className={styles.myImg}/>
                    <span className={styles.myName}>{profileData.nickname}</span>
                </div>
                <p className={styles.myStatus}>{profileData.statusMsg}</p>
            </li>}
        </>
    );
}

