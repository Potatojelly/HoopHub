import React from 'react';
import styles from './Logo.module.css'
import {IoIosBasketball} from "react-icons/io";
import {Link} from "react-router-dom";
import { usePostContext } from '../../context/PostContext';
export default function Logo() {
    const {setSelectedPage,setPostID} = usePostContext();
    return (
        <Link to="/" style={{textDecoration:"none", color: "black"}} onClick={()=>{setSelectedPage(null); setPostID(null);}}>
            <div className={styles.logoContainer}>
                <IoIosBasketball className={styles.logo}/>
                <h1>Hoop Hub</h1>
            </div>
        </Link>
    );
}

