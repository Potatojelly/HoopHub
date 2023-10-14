import React, {useEffect, useState} from 'react';
import styles from './Header.module.css';
import {Link} from "react-router-dom";
import Button from '../Button/Button';
import {AiOutlineMessage} from "react-icons/ai";
import {RiUserSearchFill} from "react-icons/ri";
import {TbMessageCircleSearch} from "react-icons/tb";
import {PiNotePencilBold} from "react-icons/pi";
import {GiHamburgerMenu} from "react-icons/gi";
import {IoIosArrowDown} from "react-icons/io";
import SideBar from '../SideBar/SideBar'; 
import Logo from '../Logo/Logo';
import { useAuth } from '../../context/AuthContext';
import Dropdown from '../Dropdown/Dropdown';
import { useProfile } from '../../context/ProfileContext';

export default function Header({friendService}) {
    const {user} = useAuth();
    const {nickname, imageURL} =useProfile();
    const [sidebar, setSidebar] = useState(false);
    const [myStuff, setMyStuff] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const showMyStuff = () => setMyStuff(!myStuff);

    return (
        <header id="header" className={styles.header}>
            <div className={styles.container}>
                {user && 
                    <button className={styles.toggleBtn}>
                        <GiHamburgerMenu className={styles.toggle} onClick={showSidebar}/>
                    </button>}
                <SideBar sidebar={sidebar} showSidebar={showSidebar} friendService={friendService}/> 
                <Logo/>
            </div>
            <nav className={styles.nav}>   
                {user &&
                    <>
                        <Link to="/"> 
                            <PiNotePencilBold className={styles.service}/>
                        </Link>
                        <Link to="/messages"> 
                            <AiOutlineMessage  className={styles.service}/>
                        </Link>
                        <Link to="/find-chat-rooms"> 
                            <TbMessageCircleSearch  className={styles.service}/>
                        </Link>
                        <Link to="/people"> 
                            <RiUserSearchFill  className={styles.service}/>
                        </Link>
                        <div className={styles.headerUser}>
                            <button className={styles.headerUserBtn} onClick={showMyStuff}>
                                <div>
                                    <img src={`${imageURL ? imageURL : "defaultProfileImg.svg" }`} alt="userImg"  className={styles.userImg}/>
                                </div>
                                <span className={styles.userNickname}>
                                    {nickname}
                                </span>
                                <IoIosArrowDown className={styles.arrowDown}/>
                            </button>
                            {myStuff && <Dropdown myStuff={myStuff} showMyStuff={showMyStuff}/>}
                        </div>
                    </>}
                {!user && <Link to="/login">
                    <Button text={"Login"}></Button>
                </Link>}
            </nav>
        </header>
    );
}

