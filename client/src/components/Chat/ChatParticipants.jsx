import React, { useState } from 'react';
import styles from './ChatParticipants.module.css'
import ParticipantCard from './ParticipantCard';
import {AiOutlineUserAdd} from "react-icons/ai";
import { useProfile } from '../../context/ProfileContext';
import UserInvite from './UserInvite';

export default function ChatParticipants({users,groupAdmin,handleKickout,handleInvitation,searchService}) {
    const {nickname} = useProfile();
    const [invitation,setInvitation] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <span className={styles.title}>Participants</span>
                {groupAdmin === nickname && 
                    <button className={styles.addUserBtn} onClick={()=>{setInvitation(true)}}>
                        <AiOutlineUserAdd/>
                    </button>}
            </div>
            {!invitation && users.map((user,index)=>{
                return <ParticipantCard key={index} user={user} groupAdmin={groupAdmin} handleKickout={handleKickout}/>
                })}
            {invitation && <UserInvite searchService={searchService} setInvitation={setInvitation} participants={users} handleInvitation={handleInvitation}/>} 
        </div>
    );
}

