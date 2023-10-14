import React from 'react';
import styles from './Dropdown.module.css'
import UserServiceButton from '../Button/UserServiceButton';
import { useAuth } from '../../context/AuthContext';
import {useNavigate} from "react-router-dom";
export default function Dropdown({myStuff,showMyStuff}) {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const directToEditProfile = () =>{
        showMyStuff();
        navigate("/edit-profile");
    }
    const directToResetPassword = () =>{
        showMyStuff();
        navigate("/reset-password");
    }
    const directToMyActivity = () =>{
        showMyStuff();
        navigate("/manage-my-activity");
    }
    return (
        <div className={`${styles.container} ${myStuff && styles.containerActive}`}>
            <UserServiceButton text={"Edit Profile"} onClick={directToEditProfile}/>
            <UserServiceButton text={"Manage My Activity"} onClick={directToMyActivity}/>
            <UserServiceButton text={"Reset Password"} onClick={directToResetPassword}/>
            <UserServiceButton text={"Logout"} onClick={logout}/>
        </div>
    );
}

