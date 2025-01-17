import React, { useEffect, useState } from 'react';
import styles from './PostCard.module.css'
import {PiArticle} from "react-icons/pi";
import {GoComment} from "react-icons/go";
import {BsFillEyeFill} from "react-icons/bs";
import {simplifyDate} from "../../date.js";
import {useNavigate} from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import {useLocation  } from "react-router-dom";

export default function PostCard({id, num, post, currentPage, keyword, last}) {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const postNum = parseInt(searchParams.get("postNum"));
    const page = parseInt(searchParams.get("page"));
    const {user} = useAuth();
    const [highlightedTitle,setHighlightedTitle] = useState("");

    useEffect(()=>{
        if(keyword) {
            const pattern = new RegExp(keyword, 'gi');
            setHighlightedTitle(post.title.replace(pattern,(match)=>`<em>${match}</em>`));
        }
    },[keyword,post.title])

    const handleClick = () => {
        if(user) {
            const contentElement = document.querySelector('#header');
            contentElement.scrollIntoView({ behavior: 'smooth' });
            navigate(`/forums/post?title=${post.title}&postNum=${id}&page=${currentPage}`,{state:true});
        }
        else alert("You do not have permission to view articles, Please Log in");
    }

    return (
        <>
            {post.deleted === 0 && 
            <div className={`${styles.container} ${last && styles.lastContainer} ${postNum === id && styles.selectedContainer}`} onClick={handleClick}>
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



