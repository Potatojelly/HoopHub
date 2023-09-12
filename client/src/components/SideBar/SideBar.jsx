import React from 'react';
import styles from './SideBar.module.css'
import {AiOutlineClose} from "react-icons/ai";
import {CgProfile} from "react-icons/cg";
import {Link} from 'react-router-dom';

export default function SideBar({sidebar,showSidebar}) {
    return (
        <nav className={`${styles.navMenu} ${sidebar && styles.navMenuActive}`}>
            <ul className={styles.navMenuItems}>
                <li className={styles.toggle}>
                    <Link to="#">
                        <AiOutlineClose className={styles.closeBtn} onClick={showSidebar}/>
                    </Link>
                </li>
                <li className={styles.myContainer}>
                    <div className={styles.mySubContainer}>
                        <CgProfile className={styles.myProfile}/>
                        <span className={styles.myName}>My name</span>
                    </div>
                    <p className={styles.myComment}>My Comments</p>
                </li>
                <li className={styles.label}>
                    <div className={styles.stick}></div>
                    Friend's List
                    <div className={styles.stick}></div>
                </li>
                <li className={styles.friendContainer}>
                    <CgProfile className={styles.friendProfile}/>
                    <div className={styles.friendSubContainer}>
                        <span className={styles.friendName}>Friend name</span>
                        <p className={styles.friendComment}>Friend Comments~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</p>
                    </div>
                </li>
            </ul>
        </nav>
    );
}

