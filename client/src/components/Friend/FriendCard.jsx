import React from 'react';
import styles from './FriendCard.module.css'

export default function FriendCard({id, nickname, imageURL, statusMsg, setPosition, selectedFriend, setSelectedFriend}) {
    const handleClick = (e) => {
        if(selectedFriend === id) {
            setSelectedFriend(null);
            return;
        }
        setSelectedFriend(id);
        setPosition({ x: e.clientX, y: e.clientY });
    }

    return (
        <li className={styles.friendContainer} onClick={handleClick}>
            <img src={imageURL} alt="myImg"  className={styles.friendImg}/>
            <div className={styles.friendSubContainer}>
                <span className={styles.friendName}>{nickname}</span>
                <p className={styles.friendStatus}>{statusMsg}</p>
            </div>
        </li>
    );
}

