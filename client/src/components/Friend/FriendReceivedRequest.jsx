import React, {useState } from 'react';
import styles from './FriendReceivedRequest.module.css'
import useFriend from '../../hooks/useFriend';

export default function FriendReceivedRequest({nickname, imageURL, friendService}) {
    const [response,setResponse] = useState(undefined);
    const {acceptRequest, rejectRequest} = useFriend(friendService)
    const handleResponse = (e) => {
        if(e.target.id === "accept") {
            acceptRequest.mutate(nickname,
                {
                    onSuccess: () => {setResponse("Accepted");},
                    onError: (err) => {console.log(err);}
                }
            )
        } else {
            rejectRequest.mutate(nickname,
                {
                    onSuccess: () => {setResponse("Deleted");},
                    onError: (err) => {console.log(err);}
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
        </li>
    );
}

