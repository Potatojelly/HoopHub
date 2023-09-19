import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {PiCameraPlus} from "react-icons/pi";
import {BsPencilSquare} from "react-icons/bs";
import styles from './EditProfile.module.css';
import EditStatusMsg from '../components/EditStatusMsg/EditStatusMsg';
import axios from "axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function EditProfile() {
    const [msg,setMsg] = useState("");
    const [img,setImg] = useState("");
    const {user, imageURL,statusMsg, updateImg} = useAuth();
    const [editing,setEditing] = useState(false);
    const [errors, setErrors] = useState("");
    const [success,setSuccess] = useState("");
    const imgInputRef = useRef(null);
    const imgUploadRef = useRef(null);

    const handleMsgEdit = () => {
        setErrors("");
        setEditing(!editing);
    }

    const uploadImg = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if(file === undefined) return;
        console.log(file);
        if(file.size > MAX_FILE_SIZE) {
            alert("File size can be up to 5MB ")
            return;
        }
        setImg(file);
        console.log(img);
        const formData = new FormData();
        formData.append("image",file);
        updateImg(user.username, formData)
            .then((data)=>{
                setSuccess(data.message);
                setTimeout(()=>{setSuccess("")},4000);
            })
            .catch((err)=>{
                console.log(err);
                setErrors(err);
            })
    }

    useEffect(() => {
        if(statusMsg) setMsg(statusMsg);
    },[statusMsg])

    return (
        <div className={styles.editContainer}>
            <div className={styles.editSubContainer}>
                <h1 className={styles.title}>Edit Profile</h1>
                <div className={styles.userImgContainer}>
                    <img src={imageURL ? imageURL : "defaultProfileImg.svg"} alt="userImg"  className={`${styles.userImg} ${errors.imageURL && styles.imageURLError}`}/>
                    <input type="file" accept="image/jpeg, image/png, image.jpg" style={{display:"none"}} onChange={uploadImg} ref={imgInputRef}/>
                    <button className={styles.editImgBtn} onClick={()=>imgInputRef.current.click()}>
                        <PiCameraPlus className={styles.editImgIcon}/>
                    </button>
                </div>
                {!editing && 
                <div className={`${styles.userStatusMsgContainer} ${errors.statusMsg && styles.statusMsgError}`}>
                    <p className={styles.statusMsg}>{msg}</p>
                    <button className={styles.editMsgBtn} onClick={handleMsgEdit}>
                        <BsPencilSquare className={styles.editMsgIcon}/>
                    </button>
                </div>}
                <small className={styles.errorMsg}>{errors.imageURL && errors.imageURL}</small>
                <small className={styles.errorMsg}>{errors.statusMsg && errors.statusMsg}</small>
                {success && <p className={styles.successMsg}> ✅ {success} </p>}
                {editing && <EditStatusMsg 
                                currentMsg={msg} 
                                setMsg={setMsg} 
                                setErrors={setErrors} 
                                onClose={handleMsgEdit}
                                setSuccess={setSuccess}/>}
            </div>
        </div>
    );
}

