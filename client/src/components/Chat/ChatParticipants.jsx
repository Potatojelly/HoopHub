import React from 'react';
import styles from './ChatParticipants.module.css'
import ParticipantCard from './ParticipantCard';

export default function ChatParticipants({users}) {
    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <span className={styles.title}>Participants</span>
            </div>
            {users.map((user,index)=><ParticipantCard key={index} user={user}/>)}
        </div>
    );
}

