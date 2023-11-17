import React, { useState } from 'react';
import styles from './FriendRequest.module.css'
import { useCancelFriendRequest } from '../../hooks/useFriendData';
import Alarm from '../Alarm/Alarm';

export default function FriendRequest({nickname, imageURL}) {
    const [isDeleted,setDeleted] = useState(false);
    const [isError,setIsError] = useState(false);
    const {mutate:cancelFriendRequest} = useCancelFriendRequest();
    const handleDelete = () => {
        cancelFriendRequest(nickname,
            {
                onSuccess: () => {setDeleted(true);},
                onError: (err) => {
                    setIsError(true)
                    setTimeout(()=>{setIsError(false)},4000)
                }
            }
        )
    }

    return (
        <li className={styles.requestCard}>
            <img src={imageURL ? imageURL : "defaultProfileImg.svg" } alt="userImg" className={styles.userImg}/>
            <div className={styles.userName}>{nickname}</div>
            {!isDeleted &&
                <>
                    <div className={styles.requestStatus}> Friend Pending </div>
                    <button className={styles.deleteBtn} onClick={handleDelete}> Delete </button>
                </>
            }
            {isDeleted &&
                <button className={styles.resultBtn} disabled={true}>
                    Deleted
                </button>
            }
            {isError && <Alarm message={"Something went wrong..."}/>}
        </li>
    );
}

