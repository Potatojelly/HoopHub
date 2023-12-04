import React from 'react';
import styles from './FriendDropdown.module.css'
import { useDeleteFriend} from '../../hooks/useFriendData';

export default function FriendDropdown({position,nickname,setDeleted,setDeletedMsg}) {
    const {mutate: deleteFriend} = useDeleteFriend()

    const handleDelete = () => {
        deleteFriend(nickname,
            {
                onSuccess: () => {
                    setDeleted(true);
                    setDeletedMsg(`${nickname} is deleted.`);
                    setTimeout(()=>{
                        setDeleted(false);
                        setDeletedMsg("");
                    },3000)
                },
                onError: () => {
                    setDeletedMsg(`Failed to delete${nickname}.`);
                    setTimeout(()=>{
                        setDeleted(false);
                        setDeletedMsg("");
                    },3000)
                }
            }
        )
    }
    return (
        <div className={styles.dropdown}
            style={{ top: `${position.y}px`, left: `${position.x}px` }}>
            <ul className={styles.list}>
                <li className={styles.item} onClick={handleDelete}>Delete</li>
            </ul>
        </div>
    );
}

