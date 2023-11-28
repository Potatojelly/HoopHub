import React from 'react';
import styles from './Forums.module.css'
import PostCreateEntry from '../components/Forum/PostCreateEntry';
import Posts from '../components/Forum/Posts';
import SearchBar from '../components/Forum/SearchBar';

export default function Forums() {
    
    return (
        <div className={styles.forum}>
            <PostCreateEntry/>
            <Posts />
            <SearchBar />
        </div>
    );
}

