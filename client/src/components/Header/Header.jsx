import React, {useState} from 'react';
import styles from './Header.module.css';
import {Link} from "react-router-dom";
import Button from '../Button/Button';
import {AiOutlineMessage} from "react-icons/ai";
import {RiUserSearchFill} from "react-icons/ri";
import {PiNotePencilBold} from "react-icons/pi";
import {GiHamburgerMenu} from "react-icons/gi";
import {IoIosArrowDown} from "react-icons/io";
import SideBar from '../SideBar/SideBar'; 
import Logo from '../Logo/Logo';
import { useAuth } from '../../context/AuthContext';
import Dropdown from '../Dropdown/Dropdown';
import { useMyProfileData } from '../../hooks/useMyProfileData';
import SmallLoadingSpinner from '../Loader/SmallLoadingSpinner';

export default function Header() {
    const {user} = useAuth();
    const {data: profileData,isFetching} = useMyProfileData();
    const [sidebar, setSidebar] = useState(false);
    const [subFunctions, setSubFunctions] = useState(false);

    const showSidebar = () => setSidebar(prev=>!prev);
    const showSubFunctions = () => setSubFunctions(prev=>!prev);

    return (
        <header id="header" className={styles.header}>
            <div className={styles.container}>
                {user && 
                    <button className={styles.toggleBtn}>
                        <GiHamburgerMenu className={styles.toggle} onClick={showSidebar}/>
                    </button>}
                {sidebar && <SideBar sidebar={sidebar} showSidebar={showSidebar} />}
                <Logo/>
            </div>
            <nav className={styles.nav}>   
                {user &&
                    <>
                        <Link to="/"> 
                            <PiNotePencilBold className={styles.service}/>
                        </Link>
                        <Link to="/messages/inbox"> 
                            <AiOutlineMessage  className={styles.service}/>
                        </Link>
                        <Link to="/friends"> 
                            <RiUserSearchFill  className={styles.service}/>
                        </Link>
                        <div className={styles.headerUser}>
                            {isFetching && <SmallLoadingSpinner/>}
                            {profileData && <button className={styles.headerUserBtn} onClick={showSubFunctions}>
                                <div>
                                    <img src={profileData && profileData.imageURL} alt="userImg"  className={styles.userImg}/>
                                </div>
                                <span className={styles.userNickname}>
                                    {profileData && profileData.nickname}
                                </span>
                                <IoIosArrowDown className={styles.arrowDown}/>
                            </button>}
                            {profileData && subFunctions && <Dropdown myStuff={subFunctions} showMyStuff={showSubFunctions}/>}
                        </div>
                    </>}
                {!user && <Link to="/login">
                    <Button text={"Login"}></Button>
                </Link>}
            </nav>
        </header>
    );
}

