import React from 'react';
import styles from './ActivityPostCard.module.css';
import {simplifyDate} from '../../date';
import {useNavigate,useParams} from "react-router-dom";

export default function ActivityPostCard({post,num,selectedCard,setSelectedCard}) {
    const navigate = useNavigate();
    const {userNickname} = useParams();
    
    const navigateToPost = () => {
        const state = {type:1, my_posts: num};
        const title = post.title;
        window.history.pushState(state,title);
        setSelectedCard(num);
        if(userNickname) navigate(`/user-activity/${userNickname}/post?title=${post.title}&postNum=${post.id}`);
        else navigate(`/my-activity/post?title=${post.title}&postNum=${post.id}`);
    }

    return (
        <div className={`${styles.container} ${selectedCard === num && styles.selectedContainer}`} onClick={navigateToPost}>
            <span className={styles.postNum}>{num}</span>
            <div className={styles.postSubContainer}>
                <span className={styles.postTitle}>{post.title}</span>
                <span className={styles.postCommentCounter}>{`[${post.total_comments}]`}</span>
            </div>
            <span className={styles.postCreatedDate}>{simplifyDate(post.created_at)}</span>
            <span className={styles.postView}>{post.views}</span>
        </div>
    );
}

