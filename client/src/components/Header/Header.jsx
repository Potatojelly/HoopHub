import React, {useState} from 'react';
import styles from './Header.module.css';
import {Link} from "react-router-dom";
import Button from '../Button/Button';
import {AiOutlineMessage} from "react-icons/ai";
import {RiUserSearchFill} from "react-icons/ri";
import {TbMessageCircleSearch} from "react-icons/tb";
import {PiNotePencilBold} from "react-icons/pi";
import {GiHamburgerMenu} from "react-icons/gi";
import SideBar from '../SideBar/SideBar'; 
import Logo from '../Logo/Logo';
import { useAuth } from '../../context/AuthContext';



export default function Header() {
    const {user,logout} = useAuth();
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    const handleLogout = () =>{
        logout();
    }
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {user && 
                    <button className={styles.toggleBtn}>
                        <GiHamburgerMenu className={styles.toggle} onClick={showSidebar}/>
                    </button>}
                <SideBar sidebar={sidebar} showSidebar={showSidebar}/> 
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
                        <Button text={"Logout"} onClick={handleLogout}></Button>
                    </>}
                {!user && <Link to="/login">
                    <Button text={"Login"}></Button>
                </Link>}
            </nav>
        </header>
    );
}

