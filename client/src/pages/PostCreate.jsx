import React from 'react';
import styles from './PostCreate.module.css';
import PostEditor from "../components/Forum/PostEditor";
export default function PostCreate({postService}) {
    return (
        <div className={styles.container}>
            <PostEditor postService={postService}/>
        </div>
    );
}

