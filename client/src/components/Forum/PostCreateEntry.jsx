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
                
                    <img src={profileData?.imageURL} alt="myImg"  className={styles.myImg}/>
                <input className={styles.linker}
                        type="text" 
                        placeholder="Create Post"
                        onClick={()=>{navigate("/create-post")}}/>
                <button className={styles.createBtn} onClick={()=>{navigate("/create-post")}}>Create</button>
            </div>}
        </>
    );
}

