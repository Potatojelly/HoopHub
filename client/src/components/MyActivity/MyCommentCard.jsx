import React from 'react';
import styles from './MyCommentCard.module.css'
import {simplifyDate} from '../../date';
import {useNavigate} from "react-router-dom";
import { usePostContext } from '../../context/PostContext';
import { useMyActivityContext } from '../../context/MyActivityContext';

export default function MyCommentCard({comment,selectedCard,setSelectedCard,num}) {
    const navigate = useNavigate();
    const {setSelectedPage,setPostID} = usePostContext();
    // const {setCommentID} = useMyActivityContext();
    const navigateToPost = () => {
        const state = {type:2, my_comments: num};
        const title = comment.post_title;
        window.history.pushState(state,title);
        console.log(comment);
        setSelectedCard(num);
        setPostID(comment.post_id);
        setSelectedPage(null);
        // navigate(`/manage-my-activity/my-post/${comment.post_title}`);
        navigate(`/manage-my-activity/my-post/${comment.post_title}`,{state:comment});
    }
    return (
        <div className={`${styles.container} ${selectedCard === num && styles.selectedContainer}`} onClick={navigateToPost}>
            <span className={styles.commentNum}>{num}</span>
            <div className={styles.commentSubContainer}>
                <span className={styles.comment} dangerouslySetInnerHTML={{ __html: comment.body }} />
                <div className={styles.postInfo}>
                    <span className={styles.postTitle}>{comment.post_title}</span>
                    <span className={styles.postCommentCounter}>{`[${comment.post_total_comments}]`}</span>
                </div>
            </div>
            <span className={styles.commentCreatedDate}>{simplifyDate(comment.created_at)}</span>
        </div>
    );
}

