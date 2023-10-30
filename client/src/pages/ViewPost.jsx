import React from 'react';
import styles from './ViewPost.module.css'
import Post from '../components/Forum/Post';
import Posts from '../components/Forum/Posts';
import SearchBar from '../components/Forum/SearchBar';
export default function ViewPost({postService}) {
    return (
        <div className={styles.viewPost}>
            <Post postService={postService}/>
            <Posts postService={postService}/>
            <SearchBar postService={postService}/>
        </div>
    );
}

