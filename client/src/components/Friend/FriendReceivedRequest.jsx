import React, {useState } from 'react';
import styles from './FriendReceivedRequest.module.css'
import { useAcceptFriendRequest, useRejectFriendRequest } from '../../hooks/useFriendData';
import Alarm from '../Alarm/Alarm';

export default function FriendReceivedRequest({nickname, imageURL}) {
    const [response,setResponse] = useState(undefined);
    const [isError,setIsError] = useState(false);
    const {mutate: accpetFriendRequest} = useAcceptFriendRequest();
    const {mutate: rejectFriendRequest} = useRejectFriendRequest();
    const handleResponse = (e) => {
        if(e.target.id === "accept") {
            accpetFriendRequest(nickname,
                {
                    onSuccess: () => {setResponse("Accepted");},
                    onError: (err) => {
                        setIsError(true)
                        setTimeout(()=>{setIsError(false)},4000)
                    }
                }
            )
        } else {
            rejectFriendRequest(nickname,
                {
                    onSuccess: () => {setResponse("Deleted");},
                    onError: (err) => {
                        setIsError(true)
                        setTimeout(()=>{setIsError(false)},4000)
                    }
                }
            )
        }
    }

    return (
        <li className={styles.requestCard}>
            <img src={imageURL ? imageURL : "defaultProfileImg.svg" } alt="userImg" className={styles.userImg}/>
            <div className={styles.userName}>{nickname}</div>
            {!response &&
                <>
                    <button id={"accept"} className={styles.acceptBtn} onClick={handleResponse}> Accept </button>
                    <button id={"delete"} className={styles.deleteBtn} onClick={handleResponse}> Delete </button>
                </>
            }
            {response &&  
                <button className={styles.resultBtn} disabled={true}>
                    {response}
                </button>
            }
            {isError && <Alarm message={"Something went wrong..."}/>}
        </li>
    );
}

