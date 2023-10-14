import React, { useState } from 'react';
import styles from './Forums.module.css'
import PostCreateEntry from '../components/Forum/PostCreateEntry';
import { useLocation} from 'react-router-dom';
import Posts from '../components/Forum/Posts';
import Post from '../components/Forum/Post';

export default function Forums({postService}) {
    const {state: post} = useLocation();
    return (
        <div className={styles.forum}>
            {!post && <PostCreateEntry/>}
            {post && <Post postID={post && (post.selectedPost ? post.selectedPost : post.id)} currentPage={post && post.currentPage} postService={postService}/>}
            <Posts postService={postService} page={post && post.currentPage} selectedPost={post && post.selectedPost}/>
        </div>
    );
}

