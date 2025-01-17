import React, { useEffect, useRef } from 'react';
import styles from './Dropdown.module.css'
import UserServiceButton from '../Button/UserServiceButton';
import { useAuth } from '../../context/AuthContext';
import {useNavigate} from "react-router-dom";

export default function Dropdown({myStuff,showMyStuff}) {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                showMyStuff();
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showMyStuff]);

    const directToEditProfile = () =>{
        showMyStuff();
        navigate("/profile");
    }
    const directToResetPassword = () =>{
        showMyStuff();
        navigate("/reset-password");
    }
    const directToMyActivity = () =>{
        showMyStuff();
        navigate("/my-activity");
    }
    
    return (
        <div className={`${styles.container} ${myStuff && styles.containerActive}`} ref={dropdownRef}>
            <UserServiceButton text={"Edit Profile"} onClick={directToEditProfile}/>
            <UserServiceButton text={"Manage My Activity"} onClick={directToMyActivity}/>
            <UserServiceButton text={"Reset Password"} onClick={directToResetPassword}/>
            <UserServiceButton text={"Logout"} onClick={logout}/>
        </div>
    );
}

