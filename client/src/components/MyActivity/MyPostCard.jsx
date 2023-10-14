import React from 'react';
import styles from './MyPostCard.module.css'
import simplifyDate from '../../date';
import {useNavigate} from "react-router-dom";
import { useSelectedCard } from '../../context/SelectedCardContext';

export default function MyPostCard({post,num,selectedCard,setSelectedCard}) {
    const navigate = useNavigate();
    const navigateToPost = () => {
        const state = {type:1, my_posts: num};
        const title = post.title;
        window.history.pushState(state,title);
        setSelectedCard(num);
        navigate(`/manage-my-activity/my-post/${post.title}`,{state: post});
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

