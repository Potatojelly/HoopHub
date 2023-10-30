import React, { useEffect, useState } from 'react';
import styles from './Forums.module.css'
import PostCreateEntry from '../components/Forum/PostCreateEntry';
import { useLocation,Outlet} from 'react-router-dom';
import Posts from '../components/Forum/Posts';
import Post from '../components/Forum/Post';
import { usePostContext } from '../context/PostContext';
import SearchBar from '../components/Forum/SearchBar';

export default function Forums({postService,init}) {
    const {state: post} = useLocation();
    const {selectedPostID} = usePostContext();
    
    return (
        <div className={styles.forum}>
           {!post && <PostCreateEntry/>}
            {/* <Outlet/> */}
            <Posts postService={postService} 
                    // page={post && post.currentPage && post.currentPage} 
                    // selectedPost={post && post.selectedPost && post.selectedPost}
                    keyword={post && post.keyword && post.keyword}/>
            {/* {post && post.currentPage && <Post postID={post && (post.selectedPost ? post.selectedPost : post.id)} currentPage={post && post.currentPage} postService={postService}/>} */}
            <SearchBar postService={postService}/>
        </div>
    );
}

