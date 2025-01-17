import React, { useEffect, useRef, useState } from 'react';
import {PiCameraPlus} from "react-icons/pi";
import {BsPencilSquare} from "react-icons/bs";
import styles from './EditProfile.module.css';
import EditStatusMsg from '../components/EditStatusMsg/EditStatusMsg';
import { useEditProfileImage, useMyProfileData } from '../hooks/useMyProfileData';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function EditProfile() {
    const [msg,setMsg] = useState("");
    const {data:profileData} = useMyProfileData();
    const {mutate:updateImg} = useEditProfileImage();
    const [editing,setEditing] = useState(false);
    const [errors, setErrors] = useState("");
    const [success,setSuccess] = useState("");
    const imgInputRef = useRef(null);

    const handleMsgEdit = (e) => {
        e.preventDefault();
        setErrors("");
        setEditing(!editing);
    }

    const uploadImg = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if(file === undefined) return;
        if(file.size > MAX_FILE_SIZE) {
            alert("File size can be up to 5MB ")
            return;
        }
        const formData = new FormData();
        formData.append("image",file);
        updateImg(formData,
            {
                onSuccess: (data)=>{
                    setSuccess(data.message);
                    setTimeout(()=>{setSuccess("")},4000);
                },
                onError: (error)=>{
                    setErrors(error)
                    setTimeout(()=>setErrors(""),4000);
                }
            }
        )
    }

    useEffect(() => {
        if(profileData?.statusMsg) setMsg(profileData.statusMsg);
    },[profileData])

    return (
        <div className={styles.editContainer}>
            <div className={styles.editSubContainer}>
                <h1 className={styles.title}>Edit Profile</h1>
                <div className={styles.userImgContainer}>
                    <img src={profileData?.imageURL} alt="userImg"  className={`${styles.userImg} ${errors.imageURL && styles.imageURLError}`}/>
                    <input type="file" accept="image/jpeg, image/png, image.jpg" style={{display:"none"}} onChange={uploadImg} ref={imgInputRef}/>
                    <button className={styles.editImgBtn} onClick={()=>imgInputRef.current.click()}>
                        <PiCameraPlus className={styles.editImgIcon}/>
                    </button>
                </div>
                {!editing && 
                <div className={`${styles.userStatusMsgContainer} ${errors.statusMsg && styles.statusMsgError}`}>
                    <p className={styles.statusMsg}>{profileData?.statusMsg}</p>
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

