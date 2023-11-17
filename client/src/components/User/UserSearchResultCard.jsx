import React, { useState } from 'react';
import styles from './UserSearchResultCard.module.css'
import { useSendFriendRequest } from '../../hooks/useFriendData';
import Alarm from '../Alarm/Alarm';

const PENDING = "pending";
export default function FriendSearchResultCard({ imageURL, nickname, friendship}) {
    const [isRequested,setIsRequested] = useState(false);
    const [isError,setIsError] = useState(false);
    const {mutate: sendFriendRequest} = useSendFriendRequest();

    const handleFriendRequest = () => {
        sendFriendRequest(nickname,
            {
                onSuccess: () => {
                    setIsRequested(true);
                },
                onError: () => {
                    setIsError(true)
                    setTimeout(()=>{setIsError(false)},4000)
                }
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
            {isError && <Alarm message={"Something went wrong..."}/>}
        </li>
    );
}

