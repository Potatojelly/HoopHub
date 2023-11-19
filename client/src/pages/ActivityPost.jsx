import React, { useEffect} from 'react';
import styles from './ActivityPost.module.css';
import { useLocation} from 'react-router-dom';
import Post from '../components/Forum/Post';
import { usePostContext } from '../context/PostContext';
import { useActivityContext } from '../context/ActivityContext';

const COMMENTSPERPAGE = 5;
export default function ActivityPost({postService}) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const postNum = parseInt(searchParams.get("postNum"));
    const {state:comment} = useLocation();
    // const {selectedPostID} = usePostContext();
    const {setCommentType,setCommentID,setCommentPage} = useActivityContext();
    useEffect(()=> {
        if(comment) {
            setCommentType(comment.type);
            setCommentID(comment.id);
            postService.getTargetCommentNumber(postNum,comment.id)
            .then((res)=>{
                console.log(Math.ceil(res.comment_number/COMMENTSPERPAGE));
                setCommentPage(Math.ceil(res.comment_number/COMMENTSPERPAGE))});
        }
    },[])

    return (
        <div className={styles.background}>
            <Post postService={postService}/>
        </div>
    );
}

