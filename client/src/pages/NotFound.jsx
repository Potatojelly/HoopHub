import React from 'react';
import styles from './NotFound.module.css'
import { MdError } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className={styles.notFoundContainer}>
            <MdError className={styles.errorIcon}/>
            <h1>Page Not Found</h1>
            <p>Sorry, we couldn't find the page you're looking for.</p>
            <Link to="/" className={styles.homeLink}>Go to Home</Link>
        </div>
    );
}

