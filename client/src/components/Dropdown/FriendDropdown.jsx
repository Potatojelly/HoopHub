import React from 'react';
import styles from './FriendDropdown.module.css'
import useFriend from '../../hooks/useFriend';

export default function FriendDropdown({position,friendService,nickname,setDeleted,setDeletedMsg}) {
    const {deleteFriend} = useFriend(friendService);

    const handleDelete = (e) => {
        deleteFriend.mutate(nickname,
            {
                onSuccess: () => {
                    setDeleted(true);
                    setDeletedMsg(`${nickname} has deleted!`);
                    setTimeout(()=>{
                        setDeleted(false);
                        setDeletedMsg("");
                    },4000)
                },
                onError: (err) => {console.log(err);}
            }
        )
    }
    return (

            <div className={styles.dropdown}
                style={{ top: `${position.y}px`, left: `${position.x}px` }}>
                <ul className={styles.list}>
                    <li className={styles.item} onClick={handleDelete}>Delete</li>
                    <li className={styles.item}>Chat</li>
                </ul>
            </div>

    );
}

