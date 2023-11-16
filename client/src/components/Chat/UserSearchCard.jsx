import React from 'react';
import styles from './UserSearchCard.module.css'

export default function UserSearchCard({userID,imageURL,nickname,participants,setParticipants, selectedUser}) {

    const handleCheckboxChange = (e) => {
        if(e.currentTarget.checked) {
            setParticipants([...participants,{id:userID,nickname,imageURL}])
        } else {
            const filteredParticipants = participants.filter((participant)=>participant.id !== userID);
            setParticipants(filteredParticipants);
        }
        console.log(participants);
    }


    return (
        <li className={`${styles.userCard} ${(selectedUser && selectedUser.id !== userID) && styles.inactiveUserCard}`}>
            <img src={imageURL} alt="userImg" className={styles.userImg}/>
            <div className={styles.userName}>{nickname}</div>
            <input type="checkbox" 
                    value={nickname}
                    checked={participants.find((participant)=>participant.id === userID) ? true : false}
                    onChange={handleCheckboxChange}
                    />
        </li>
    );
}

