import React, { useState } from 'react';
import styles from './UserSearchResultCard.module.css'
import useFriend from '../../hooks/useFriend';

const PENDING = "pending";
export default function FriendSearchResultCard({ imageURL, nickname, friendship, friendService}) {
    const [isRequested,setIsRequested] = useState(false);
    const {sendRequest} = useFriend(friendService);

    const handleFriendRequest = (e) => {
        sendRequest.mutate(nickname,
            {
                onSuccess: (data) => {
                    setIsRequested(true);
                },
                onError: (err) => {console.log(err);},
            }
        )
    }

    return (
        <li className={styles.userCard}>
            <img src={imageURL} alt="userImg" className={styles.userImg}/>
            <div className={styles.userName}>{nickname}</div>
            <button 
                className={`${styles.requestBtn} ${friendship && styles.requestBtnInactive} ${isRequested && styles.requestedBtn}`} 
                onClick={handleFriendRequest}
                disabled={(friendship===null ? false : true) || (isRequested ? true : false)}> 
                {!isRequested && (friendship === null ? "Request Friend" : friendship === PENDING ? "Friend Pending" : "Already Friend")}
                {isRequested && "Sent Request"}
            </button>
        </li>
    );
}

