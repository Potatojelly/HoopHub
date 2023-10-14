import React, { useEffect, useState } from 'react';
import styles from './MyPost.module.css'
import { useLocation} from 'react-router-dom';
import Post from '../components/Forum/Post';
import {useNavigate} from "react-router-dom";
const COMMENTSPERPAGE = 5;
export default function MyPost({postService}) {
    const {state: post} = useLocation();
    const [targetPage,setTargetPage] = useState(null);
    useEffect(()=> {
        if(post.comment_id) {
            postService.getTargetCommentNumber(post.id,post.comment_id)
                .then((res)=>setTargetPage(Math.ceil(res.comment_number/COMMENTSPERPAGE)));
        }
    },[])

    return (
        <div className={styles.background}>
            {post && <Post postID={post.id} targetCommentID={post.comment_id} targetPage={targetPage} postService={postService}/>}
        </div>
    );
}

