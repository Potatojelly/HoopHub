import React, { useEffect, useRef, useState } from 'react';
import styles from './SideBar.module.css'
import {AiOutlineClose} from "react-icons/ai";
import {Link} from 'react-router-dom';
import FriendCard from '../Friend/FriendCard';
import MyProfile from '../MyProfile/MyProfile';
import useFriend from '../../hooks/useFriend';
import {v4 as uuidv4} from "uuid";
import FriendDropdown from '../Dropdown/FriendDropdown';
import Alarm from '../Alarm/Alarm';

export default function SideBar({sidebar,showSidebar, friendService}) {
    const {myFriend} = useFriend(friendService);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [deleted,setDeleted] = useState(false);
    const [deletedMsg,setDeletedMsg] = useState("");
    const dropdownRef = useRef(null);

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
                    <Link to="#">
                        <AiOutlineClose className={styles.closeBtn} onClick={showSidebar} />
                    </Link>
                </li>
                <MyProfile/>
                <li className={styles.label}>
                    <div className={styles.stick}></div>
                    Friend's List
                    <div className={styles.stick}></div>
                </li>
                <div ref={dropdownRef}>
                    {myFriend && myFriend.map((friend,index) => (
                                <div key={uuidv4()}>
                                    <FriendCard id = {index}
                                                nickname={friend.nickname} 
                                                imageURL={friend.imageURL}
                                                statusMsg={friend.statusMsg}
                                                friendService={friendService}
                                                selectedFriend={selectedFriend}
                                                setSelectedFriend={setSelectedFriend}
                                                setPosition={setPosition}/>
                                    {selectedFriend === index && <FriendDropdown position={position} 
                                                                                friendService={friendService} 
                                                                                nickname={friend.nickname}
                                                                                setDeleted={setDeleted}
                                                                                setDeletedMsg={setDeletedMsg}/>}
                                </div>
                            ))
                    }
                </div>
            </ul>
            {deleted && <Alarm message={deletedMsg}/>}
        </nav>
    );
}

