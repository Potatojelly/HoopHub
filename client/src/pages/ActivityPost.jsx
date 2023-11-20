import React, { useEffect} from 'react';
import styles from './ActivityPost.module.css';
import { useLocation} from 'react-router-dom';
import Post from '../components/Forum/Post';
import { useActivityContext } from '../context/ActivityContext';

const COMMENTSPERPAGE = 5;
export default function ActivityPost({postService}) {
    const location = useLocation();
    const {state:comment} = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const postNum = parseInt(searchParams.get("postNum"));
    const {setCommentType,setCommentID,setCommentPage} = useActivityContext();

    useEffect(()=> {
        if(comment) {
            setCommentType(comment.type);
            setCommentID(comment.id);
            postService.getTargetCommentNumber(postNum,comment.id)
            .then((res)=>{
                setCommentPage(Math.ceil(res.comment_number/COMMENTSPERPAGE))});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[comment])

    return (
        <div className={styles.background}>
            <Post />
        </div>
    );
}

