import React from 'react';
import styles from './ParticipantCard.module.css'

export default function ParticipantCard({user}) {
    return (
        <div className={styles.card}>
            <img className={styles.profileImg} src={user.imageURL} alt="profileImg" />
            <span className={styles.name}>{user.nickname}</span>
        </div>
    );
}

