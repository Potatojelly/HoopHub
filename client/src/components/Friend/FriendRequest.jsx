import React, { useState } from 'react';
import styles from './FriendRequest.module.css'
import useFriend from '../../hooks/useFriend';

export default function FriendRequest({nickname, imageURL, friendService}) {
    const [isDeleted,setDeleted] = useState(false);
    const {cancelRequest} = useFriend(friendService);

    const handleDelete = () => {
        cancelRequest.mutate(nickname,
            {
                onSuccess: () => {setDeleted(true);},
                onError: (err) => {console.log(err);}
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
        </li>
    );
}

