import React, { useState } from 'react';
import styles from './UserSearchCard.module.css'

export default function UserSearchCard({userID,imageURL,nickname,selectedUser,setSelectedUser}) {
    const handleCheckboxChange = () => {
        if(selectedUser) {
            setSelectedUser(null);
        } else {
            setSelectedUser({id:userID,nickname});
        } 
        
    };

    return (
        <li className={`${styles.userCard} ${(selectedUser && selectedUser.id !== userID) && styles.inactiveUserCard}`}>
            <img src={imageURL} alt="userImg" className={styles.userImg}/>
            <div className={styles.userName}>{nickname}</div>
            <input type="checkbox" 
                    value={nickname}
                    checked={selectedUser && selectedUser.id === userID ? true : false}
                    onChange={handleCheckboxChange}
                    disabled={(selectedUser && selectedUser.id !== userID) ? true : false}
                    />
        </li>
    );
}

