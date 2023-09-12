import React from 'react';
import styles from './Logo.module.css'
import {IoIosBasketball} from "react-icons/io";
import {Link} from "react-router-dom";
export default function Logo() {
    return (
        <Link to="/" style={{textDecoration:"none", color: "black"}}>
            <div className={styles.logoContainer}>
                <IoIosBasketball className={styles.logo}/>
                <h1>Hoop Hub</h1>
            </div>
        </Link>
    );
}

