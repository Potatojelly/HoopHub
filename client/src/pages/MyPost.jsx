import React, { useEffect, useState } from 'react';
import styles from './MyPost.module.css'
import { useLocation} from 'react-router-dom';
import Post from '../components/Forum/Post';
import {useNavigate} from "react-router-dom";
import { usePostContext } from '../context/PostContext';
import { useMyActivityContext } from '../context/MyActivityContext';

const COMMENTSPERPAGE = 5;
export default function MyPost({postService}) {
    const {state:comment} = useLocation();
    const {selectedPostID} = usePostContext();
    const {setCommentType,setCommentID,setCommentPage} = useMyActivityContext();
    // const [targetPage,setTargetPage] = useState(null);
    useEffect(()=> {
        if(comment) {
            setCommentType(comment.type);
            setCommentID(comment.id);
            postService.getTargetCommentNumber(selectedPostID,comment.id)
            .then((res)=>setCommentPage(Math.ceil(res.comment_number/COMMENTSPERPAGE)));
        }
        // if(post.comment_id) {
        //     postService.getTargetCommentNumber(post.id,post.comment_id)
        //         .then((res)=>setTargetPage(Math.ceil(res.comment_number/COMMENTSPERPAGE)));
        // }
    },[])

    return (
        <div className={styles.background}>
            <Post postService={postService}/>
            {/* {post && <Post postID={post.id} targetCommentID={post.comment_id} targetCommentPage={targetPage} postService={postService}/>} */}
        </div>
    );
}

