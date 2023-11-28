import React from 'react';
import styles from './UserActivityLog.module.css'
import { useUserProfile } from '../hooks/useUserProfile';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/Activity/UserProfile';
import ActivityLog from './ActivityLog';


export default function UserActivityLog() {
    const {userNickname} = useParams();
    const {data:userProfile} = useUserProfile(userNickname);
    return (
        <div className={styles.activityContainer}>
            {userProfile && 
            <>
                <UserProfile userNickname={userProfile?.nickname} imageURL={userProfile?.imageURL} statusMsg={userProfile?.statusMsg}/>
                <ActivityLog userNickname={userProfile?.nickname}/>
            </>}
        </div>
    );
}

