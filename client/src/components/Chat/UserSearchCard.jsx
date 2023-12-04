import React from 'react';
import styles from './UserSearchCard.module.css'

export default function UserSearchCard({userID,userMongoID,imageURL,nickname,participants,setParticipants, selectedUser}) {

    const handleCheckboxChange = (e) => {
        if(e.currentTarget.checked) {
            setParticipants([...participants,{id:userMongoID,userID:userID,nickname,imageURL}])
        } else {
            const filteredParticipants = participants.filter((participant)=>participant.id !== userMongoID);
            setParticipants(filteredParticipants);
        }
    }
    
    return (
        <li className={`${styles.userCard} ${(selectedUser && selectedUser.id !== userMongoID) && styles.inactiveUserCard}`}>
            <img src={imageURL} alt="userImg" className={styles.userImg}/>
            <div className={styles.userName}>{nickname}</div>
            <input type="checkbox" 
                    value={nickname}
                    checked={participants.find((participant)=>participant.id === userMongoID) ? true : false}
                    onChange={handleCheckboxChange}
                    />
        </li>
    );
}

