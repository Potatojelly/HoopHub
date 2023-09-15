import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {PiCameraPlus} from "react-icons/pi";
import {BsPencilSquare} from "react-icons/bs";
import styles from './EditProfile.module.css';
import EditStatusMsg from '../components/EditStatusMsg/EditStatusMsg';

export default function EditProfile() {
    const [msg,setMsg] = useState("Enter a status message~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    const {imageURL,statusMsg} = useAuth();
    const [editing,setEditing] = useState(false);

    const handleMsgEdit = () => {
        setEditing(!editing);
    }

    useEffect(() => {
        if(statusMsg) setMsg(statusMsg);
    },[statusMsg])
    return (
        <div className={styles.editContainer}>
            <div className={styles.editSubContainer}>
                <div className={styles.userImgContainer}>
                    <img src={`${imageURL ? imageURL : "defaultProfileImg.svg" }`} alt="userImg"  className={styles.userImg}/>
                    <button className={styles.editImgBtn}>
                        <PiCameraPlus className={styles.editImgIcon}/>
                    </button>
                </div>
                {!editing && <div className={styles.userStatusMsgContainer}>
                    <p className={styles.statusMsg}>{msg}</p>
                    <button className={styles.editMsgBtn} onClick={handleMsgEdit}>
                        <BsPencilSquare className={styles.editMsgIcon}/>
                    </button>
                </div>}
                {editing && <EditStatusMsg currentMsg={msg} setMsg={setMsg} onClose={handleMsgEdit}/>}
            </div>
        </div>
    );
}

