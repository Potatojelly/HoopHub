import React from 'react';
import styles from './SideBar.module.css'
import {AiOutlineClose} from "react-icons/ai";
import {Link} from 'react-router-dom';
import Friend from '../Friend/Friend';
import MyProfile from '../MyProfile/MyProfile';

export default function SideBar({sidebar,showSidebar}) {
    return (
        <nav className={`${styles.navMenu} ${sidebar && styles.navMenuActive}`}>
            <ul className={styles.navMenuItems}>
                <li className={styles.toggle}>
                    <Link to="#">
                        <AiOutlineClose className={styles.closeBtn} onClick={showSidebar}/>
                    </Link>
                </li>
                <MyProfile/>
                <li className={styles.label}>
                    <div className={styles.stick}></div>
                    Friend's List
                    <div className={styles.stick}></div>
                </li>
                <Friend/>
            </ul>
        </nav>
    );
}

