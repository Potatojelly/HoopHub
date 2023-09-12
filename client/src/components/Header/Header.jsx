import React, {useState} from 'react';
import styles from './Header.module.css';
import {Link} from "react-router-dom";
import Button from '../Button/Button';
import {IoIosBasketball} from "react-icons/io";
import {AiOutlineMessage} from "react-icons/ai";
import {RiUserSearchFill} from "react-icons/ri";
import {TbMessageCircleSearch} from "react-icons/tb";
import {PiNotePencilBold} from "react-icons/pi";
import {GiHamburgerMenu} from "react-icons/gi";
import SideBar from '../SideBar/SideBar';
import Logo from '../Logo/Logo';



export default function Header() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <button className={styles.toggleBtn}>
                    <GiHamburgerMenu className={styles.toggle} onClick={showSidebar}/>
                </button>
                <SideBar sidebar={sidebar} showSidebar={showSidebar}/> 
                <Logo/>
            </div>
            <nav className={styles.nav}>   
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
                <Link to="/login">
                    <Button text={"Login"}></Button>
                </Link>
            </nav>
        </header>
    );
}
