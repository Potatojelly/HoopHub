import React from 'react';
import styles from './PostCreateEntry.module.css'
import { useProfile } from '../../context/ProfileContext';
import {useNavigate} from "react-router-dom";

export default function PostCreateEntry() {
    const {imageURL} = useProfile();
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            
                <img src={imageURL ? imageURL : "defaultProfileImg.svg"} alt="myImg"  className={styles.myImg}/>
            <input className={styles.linker}
                    type="text" 
                    placeholder="Create Post"
                    onClick={()=>{navigate("/create-post")}}/>
            <button className={styles.createBtn}>Create</button>
        </div>
    );
}

