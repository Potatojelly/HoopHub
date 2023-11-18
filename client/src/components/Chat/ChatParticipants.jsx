import React, { useState } from 'react';
import styles from './ChatParticipants.module.css'
import ParticipantCard from './ParticipantCard';
import {AiOutlineUserAdd} from "react-icons/ai";
import UserInvite from './UserInvite';
import { useMyProfileData } from '../../hooks/useMyProfileData';

export default function ChatParticipants({users,groupAdmin,handleKickout,handleInvitation,searchService}) {
    const {data: profileData} = useMyProfileData();
    const [invitation,setInvitation] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <span className={styles.title}>Participants</span>
                {groupAdmin === profileData?.nickname && 
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

