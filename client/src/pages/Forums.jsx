import React from 'react';
import styles from './Forums.module.css'
import PostCreateEntry from '../components/Forum/PostCreateEntry';

export default function Forums() {
    return (
        <div className={styles.forum}>
            <PostCreateEntry/>
        </div>
    );
}

