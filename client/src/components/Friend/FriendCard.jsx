import React, { useEffect, useState } from 'react';
import styles from './FriendCard.module.css'
import useFriend from '../../hooks/useFriend';
import FriendDropdown from '../Dropdown/FriendDropdown';

export default function Friend({id, nickname, imageURL, statusMsg, friendService, setPosition, selectedFriend, setSelectedFriend}) {
    const handleClick = (e) => {
        if (selectedFriend !== id) {
            setSelectedFriend(id);
            setPosition({ x: e.clientX, y: e.clientY });
        } 
        else {
            setSelectedFriend(null);
        }
    }

    return (
        <li className={styles.friendContainer} onClick={handleClick}>
            <img src={imageURL ? imageURL : "defaultProfileImg.svg"} alt="myImg"  className={styles.friendImg}/>
            <div className={styles.friendSubContainer}>
                <span className={styles.friendName}>{nickname}</span>
                <p className={styles.friendStatus}>{statusMsg}</p>
            </div>
        </li>
    );
}

