import React, { useEffect, useState } from 'react';
import styles from './PostCard.module.css'
import {PiArticle} from "react-icons/pi";
import {GoComment} from "react-icons/go";
import {BsFillEyeFill} from "react-icons/bs";
import {simplifyDate} from "../../date.js";
import {useNavigate} from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { usePostContext } from '../../context/PostContext';
import {useMutation,useQueryClient} from "@tanstack/react-query";

export default function PostCard({id, num, post, handleSelection, keyword, last}) {
    const queryClient = useQueryClient();
    const {selectedPage,selectedPostID} = usePostContext();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [highlightedTitle,setHighlightedTitle] = useState("");

    const handleClick = () => {
        if(user) {
            handleSelection(id);
            const contentElement = document.querySelector('#header');
            contentElement.scrollIntoView({ behavior: 'smooth' });
            navigate(`/forums/post/${post.title}`,{state:true});
            // navigate(`/forums/post/${post.title}`,{state: {currentPage, selectedPost: id, keyword,} })
        }
        else alert("You do not have permission to view articles, Please Log in");
    }

    useEffect(()=>{
        if(keyword) {
            console.log("Calling");
            const pattern = new RegExp(keyword, 'g');
            setHighlightedTitle(post.title.replace(pattern, `<em>${keyword}</em>`));
        }
    },[keyword])

    return (
        <>
            {post.deleted === 0 && 
            <div className={`${styles.container} ${last && styles.lastContainer} ${selectedPostID === id && styles.selectedContainer}`} onClick={handleClick}>
                <div className={styles.postNum}>{num}</div>
                {post.thumbnail_url && <img src={post.thumbnail_url} alt="postImg" className={styles.postImg}/>}
                {!post.thumbnail_url && <PiArticle className={styles.iconImg}/>}
                {keyword ? <div className={styles.title} dangerouslySetInnerHTML={{ __html: highlightedTitle }} /> : <div className={styles.title}>{post.title}</div>}
                <div className={styles.commentCounter}><GoComment className={styles.commentIcon}/>{`[${post.total_comments}]`}</div>
                <div className={styles.author}>{post.nickname}</div>
                <div className={styles.createdAt}>{simplifyDate(post.created_at)}</div>
                <div className={styles.views}><BsFillEyeFill/>{post.views}</div>
            </div>}
            {post.deleted === 1 && 
            <div className={`${last && styles.deletedLastContainer} ${styles.deletedContainer}`} >
                <div className={styles.postNum}>{num}</div>
                <div className={styles.deletedPost}>
                    <span>
                        Deleted Post
                    </span>
                </div>
            </div>}
        </>
    );
}



