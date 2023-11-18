import React from 'react';
import styles from './MyProfile.module.css'
import { useMyProfileData } from '../../hooks/useMyProfileData';
import LoadingSpinner from '../Loader/LoadingSpinner';

export default function MyProfile() {
    const {data: profileData,isFetching} = useMyProfileData();
    return (
        <>
            {profileData && 
            <li className={styles.myContainer}>
                <div className={styles.mySubContainer}>
                    <img src={profileData.imageURL} alt="myImg"  className={styles.myImg}/>
                    <span className={styles.myName}>{profileData.nickname}</span>
                </div>
                <p className={styles.myStatus}>{profileData.statusMsg}</p>
                {isFetching && <div className={styles.loadingSpinner}><LoadingSpinner/></div>}
            </li>}
        </>
    );
}

