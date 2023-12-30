import React, { useEffect, useState} from 'react';
import styles from './ActivityPost.module.css';
import { useLocation} from 'react-router-dom';
import Post from '../components/Forum/Post';
import { useActivityContext } from '../context/ActivityContext';
import { useUpdatePostView } from '../hooks/usePostsData';

const COMMENTSPERPAGE = 5;
export default function ActivityPost({postService}) {
    const location = useLocation();
    const {state:comment} = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const postNum = parseInt(searchParams.get("postNum"));
    const [isViewUpdated,setIsViewUpdated] = useState(false);
    const {mutate: updatePostView} = useUpdatePostView();
    const {selectedCommentPage,setCommentType,setCommentID,setCommentPage} = useActivityContext();

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

    useEffect(()=>{
        if(postNum) {
            if(isViewUpdated) setIsViewUpdated(false);
            updatePostView(postNum,{
                onSuccess: () => {
                    setIsViewUpdated(true);
                }
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[postNum])

    return (
        <div className={styles.background}>
            {comment ? selectedCommentPage && isViewUpdated && <Post/> : isViewUpdated && <Post/>}
        </div>
    );
}

