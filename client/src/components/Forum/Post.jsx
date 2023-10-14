import React, { useEffect, useState } from 'react';
import styles from './Post.module.css'
import Comments from './Comments';
import simplifyDate from '../../date';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import {FaRegCommentAlt} from "react-icons/fa";
import {useMutation,useQueryClient} from "@tanstack/react-query";
import {BsFillEyeFill} from "react-icons/bs";
import {FiEdit} from "react-icons/fi";
import {BsTrash3} from "react-icons/bs"
import {useNavigate} from "react-router-dom";
import PostEditor from './PostEditor';


export default function Post({postID, currentPage, targetPage, targetCommentID, postService}) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isEdit,setIsEdit] = useState(false);
    const {nickname} = useProfile();
    const [post,setPost] = useState();

    useEffect(()=>{
        if(isEdit === false) {
            postService.updateView(postID)
            .then(()=>{
                postService.getPost(postID)
                    .then((result)=>{
                        // console.log(result);
                        if(result.post.deleted === 1) {
                            console.log("called!")
                            alert(`The post "${result.post.title}" has been deleted!`);
                            navigate('/', {replace: true} );
                        } else {
                            setPost(result.post)
                            queryClient.invalidateQueries(['posts', currentPage]);
                        }
                    })
                    .catch((err)=>console.log(err))
            })
            .catch((err)=>console.log(err))
        }
    },[postID,isEdit]);

    const handleConfirm = (text) => {
        const result = window.confirm(text);
        if(result) {
            postService.deletePost(postID)
                .then((result)=>{
                    queryClient.invalidateQueries(['posts', currentPage]);
                })
                navigate('/', {replace: true} );
        } 
    } 

    const handleEdit = () => {
        setIsEdit((prev)=>!prev);
        const contentElement = document.querySelector('#header');
        contentElement.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
        {(post && !isEdit) &&
            <div className={styles.postContainer}>
                <div className={styles.postTitle}>
                    {post.title}
                    {post.nickname === nickname && 
                    <div className={styles.editContainer}>
                        <FiEdit className={styles.editIcon} onClick={()=>{handleEdit()}}/>
                        <BsTrash3 className={styles.trashIcon} onClick={()=>{handleConfirm(`Do you want to delete "${post.title}" post?`)}}/>
                    </div>}
                </div>
                <div className={styles.postInfo}>
                    <img className={styles.profileImg} src={post.image_url} alt="userImg" />
                    <div className={styles.postInfoSubContainer}>
                        <div className={styles.postNickname}>{post.nickname}</div>
                        <div className={styles.postTime}>{simplifyDate(post.created_at)}</div>
                    </div>
                    <div className={styles.views}>
                        <BsFillEyeFill/>
                        {post.views}
                    </div>
                </div>
                <div className={styles.postContent}>
                    <div dangerouslySetInnerHTML={{ __html: post.body }} />
                    <div className={styles.commentCounter}>
                        <FaRegCommentAlt/>
                        <span className={styles.commentNum}>
                            {post.total_comments}    
                        </span>
                    </div>
                </div>
                <Comments postID={post.id} postPage={currentPage} setPost={setPost} targetPage={targetPage} targetCommentID={targetCommentID} postService={postService}/>
            </div>
        }
            {isEdit &&
                <PostEditor postService={postService} post={post} handleEdit={handleEdit} currentPage={currentPage}/>
            }
        </>
    );
}

