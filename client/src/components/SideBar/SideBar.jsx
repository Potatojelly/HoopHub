import React, { useEffect, useRef, useState } from 'react';
import styles from './SideBar.module.css'
import {AiOutlineClose} from "react-icons/ai";
import FriendCard from '../Friend/FriendCard';
import MyProfile from '../MyProfile/MyProfile';
import { useFriendData } from '../../hooks/useFriendData';
import FriendDropdown from '../Dropdown/FriendDropdown';
import Alarm from '../Alarm/Alarm';
import LoadingSpinner from '../Loader/LoadingSpinner';

export default function SideBar({sidebar,showSidebar}) {
    const dropdownRef = useRef(null);
    const {data: myFriend,isFetching} = useFriendData();
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [deleted,setDeleted] = useState(false);
    const [deletedMsg,setDeletedMsg] = useState("");

    useEffect(() => {
        function handleOutsideClick(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedFriend(null);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <nav className={`${styles.navMenu} ${sidebar && styles.navMenuActive}`}>
            <ul className={styles.navMenuItems}>
                <li className={styles.toggle}>
                    <AiOutlineClose className={styles.closeBtn} onClick={showSidebar} />
                </li>
                <MyProfile/>
                <li className={styles.label}>
                    <div className={styles.stick}></div>
                    Friend List
                    <div className={styles.stick}></div>
                </li>
                {isFetching && <div className={styles.loadingSpinner}><LoadingSpinner/></div>}
                {myFriend && myFriend.myFriends.length > 0 && 
                <div ref={dropdownRef}>
                    {myFriend.myFriends.map((friend,index) => (
                                <div key={index}>
                                    <FriendCard id = {index}
                                                nickname={friend.nickname} 
                                                imageURL={friend.imageURL}
                                                statusMsg={friend.statusMsg}
                                                selectedFriend={selectedFriend}
                                                setSelectedFriend={setSelectedFriend}
                                                setPosition={setPosition}/>
                                    {selectedFriend === index && <FriendDropdown position={position} 
                                                                                nickname={friend.nickname}
                                                                                setDeleted={setDeleted}
                                                                                setDeletedMsg={setDeletedMsg}/>}
                                </div>
                            ))
                    }
                </div>}
            </ul>
            {deleted && <Alarm message={deletedMsg}/>}
        </nav>
    );
}

