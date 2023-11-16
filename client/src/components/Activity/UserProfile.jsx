import React from 'react';
import styles from './UserProfile.module.css'

export default function UserProfile({userNickname,imageURL,statusMsg}) {
    return (
        <div className={styles.profileContainer}>
            <div className={styles.title}>{userNickname}</div>
            <div className={styles.horizontalContainer}>
                <div className={styles.userImgContainer}>
                    <small style={{paddingLeft:"0.5rem"}}>Profile Image</small>
                    <img src={imageURL} alt="userImg"  className={styles.userImg}/>
                </div>
                <div className={styles.statusContainer}>
                    <small style={{paddingLeft:"0.5rem"}}>Status Message</small>
                    <div className={styles.userStatusMsgContainer}>
                        <p className={styles.statusMsg}>{statusMsg}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

