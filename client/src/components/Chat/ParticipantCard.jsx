import React from 'react';
import styles from './ParticipantCard.module.css'
import {PiCrownSimpleBold} from "react-icons/pi";
import {FiTrash} from "react-icons/fi";
import { useProfile } from '../../context/ProfileContext';

export default function ParticipantCard({user,groupAdmin,handleKickout}) {
    const {nickname} = useProfile();

    return (
        <div className={styles.card}>
            <img className={styles.profileImg} src={user.imageURL} alt="profileImg" />
            <span className={styles.name}>{user.nickname}{nickname===user.nickname && <small style={{marginLeft:"0.3rem", color:"blue"}}>(me)</small>}</span>
            {groupAdmin && groupAdmin === user.nickname  && <PiCrownSimpleBold style={{paddingLeft:"5px", color:"gold", fontSize:"2rem"}}/>}
            {user.nickname !== nickname && nickname === groupAdmin  &&  
                <div className={styles.kickBtn} onClick={()=>{handleKickout(user)}}>
                    <FiTrash/>
                </div>}
        </div>
    );
}

