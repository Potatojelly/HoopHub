import React from 'react';
import styles from './FriendSearchResultCard.module.css'

const PENDING = "pending";
const ACCEPTED = "accepted";
export default function FriendSearchResultCard({imageURL, nickname, friendship}) {
    return (
        <li className={styles.friendCard}>
            <img src={imageURL ? imageURL : "defaultProfileImg.svg" } alt="userImg" className={styles.friendImg}/>
            <div className={styles.friendName}>{nickname}</div>
            <button 
                className={`${styles.requestBtn} ${friendship && styles.requestBtnInactive}`} 
                disabled={(friendship===null ? false : true)}> 
            {friendship === null ? "Request Friend" : friendship === PENDING ? "Friend Pending" : "Already Friend"}
            </button>
        </li>
    );
}

