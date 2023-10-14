import React from 'react';
import styles from './PostCreate.module.css';
import PostCreator from "../components/Forum/PostCreator";
export default function PostCreate({postService}) {
    return (
        <div className={styles.container}>
            <PostCreator postService={postService}/>
        </div>
    );
}

