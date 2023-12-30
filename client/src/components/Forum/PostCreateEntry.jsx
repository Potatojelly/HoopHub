import React from 'react';
import styles from './PostCreateEntry.module.css'
import {useNavigate} from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { useMyProfileData } from '../../hooks/useMyProfileData';

export default function PostCreateEntry() {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {data: profileData} = useMyProfileData();

    return (
        <>
            {user && <div className={styles.container}>
                
                {!profileData && <div className={styles.imageContainer}></div>}
                {profileData && <img src={profileData?.imageURL} alt="."  className={styles.myImg}/>}
                <input className={styles.linker}
                        type="text" 
                        placeholder="Create Post"
                        onClick={()=>{navigate("/post/write")}}/>
                <button className={styles.createBtn} onClick={()=>{navigate("/post/write")}}>Create</button>
            </div>}
        </>
    );
}

