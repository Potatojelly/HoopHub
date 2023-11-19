import React, { useEffect } from 'react';
import styles from './ViewPost.module.css'
import Post from '../components/Forum/Post';
import Posts from '../components/Forum/Posts';
import SearchBar from '../components/Forum/SearchBar';
import {useLocation  } from "react-router-dom";
import { usePostContext } from '../context/PostContext';
export default function ViewPost() {
    return (
        <div className={styles.viewPost}>
            <Post/>
            <Posts/>
            <SearchBar/>
        </div>
    );
}

