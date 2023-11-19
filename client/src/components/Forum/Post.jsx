import React, { useEffect, useState } from 'react';
import styles from './Post.module.css'
import Comments from './Comments';
import {simplifyDate} from '../../date';
import {FaRegCommentAlt} from "react-icons/fa";
import {useQueryClient} from "@tanstack/react-query";
import {BsFillEyeFill} from "react-icons/bs";
import {FiEdit} from "react-icons/fi";
import {BsTrash3} from "react-icons/bs"
import {useNavigate,useLocation  } from "react-router-dom";
import PostEditor from './PostEditor';
import { useDeletePost, usePostData, useUpdatePostView } from '../../hooks/usePostsData';
import { useMyProfileData } from '../../hooks/useMyProfileData';
import LoadingSpinner from '../Loader/LoadingSpinner';
import { usePostContext } from '../../context/PostContext';


export default function Post() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const postNum = parseInt(searchParams.get("postNum"));
    const page = parseInt(searchParams.get("page"));
    // const {selectedPostID,selectedPage,setSelectedPage,setSelectedPostID} = usePostContext();
    const [isEdit,setIsEdit] = useState(false);
    const {data: profileData} = useMyProfileData();
    const {data: postData, isFetching} = usePostData(postNum);
    const {mutate: deletePost} = useDeletePost();
    const {mutate: updatePostView} = useUpdatePostView();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(()=>{
        if(postNum) {
            updatePostView(postNum);
        }
    },[postNum])

    const handleConfirm = (text) => {
        const result = window.confirm(text);
        if(result) {
            deletePost(postNum,{
                onSuccess: () => {
                    queryClient.invalidateQueries(['posts', page]);
                    navigate('/', {replace: true} );
                }
            })
        } 
    } 

    const handleEdit = () => {
        setIsEdit((prev)=>!prev);
        const contentElement = document.querySelector('#header');
        contentElement.scrollIntoView({ behavior: 'smooth' });
    }

    const viewUserActivity = () => {
        if(profileData?.nickname === postData?.post.nickname) {
            navigate(`/manage-my-activity`)
            return
        }
        navigate(`/view-user-activity/${postData?.post.nickname}`)
    }

    if(isFetching) {
        return (
            <div className={styles.postTempContainer}>
                <LoadingSpinner/>
            </div>
        )
    }

    return (
        <>
        {(postData && !isEdit) &&
            <div className={styles.postContainer}>
                <div className={styles.postTitle}>
                    {postData.post.title}
                    {postData.post.nickname === profileData?.nickname && 
                    <div className={styles.editContainer}>
                        <FiEdit className={styles.editIcon} onClick={()=>{handleEdit()}}/>
                        <BsTrash3 className={styles.trashIcon} onClick={()=>{handleConfirm(`Do you want to delete "${postData?.post.title}" post?`)}}/>
                    </div>}
                </div>
                <div className={styles.postInfo}>
                    <img className={styles.profileImg} src={postData.post.image_url} alt="userImg" />
                    <div className={styles.postInfoSubContainer}>
                        <div className={styles.postNickname} onClick={viewUserActivity}>{postData?.post.nickname}</div>
                        <div className={styles.postTime}>{simplifyDate(postData?.post.created_at)}</div>
                    </div>
                    <div className={styles.views}>
                        <BsFillEyeFill/>
                        {postData.post.views}
                    </div>
                </div>
                <div className={styles.postContent}>
                    <div className={styles.postText}dangerouslySetInnerHTML={{ __html: postData.post.body }} />
                    <div className={styles.commentCounter}>
                        <FaRegCommentAlt/>
                        <span className={styles.commentNum}>
                            {postData.post.total_comments}    
                        </span>
                    </div>
                </div>
                {postNum && <Comments selectedPostID={postNum}/>}
            </div>
        }
            {isEdit &&
                <PostEditor post={postData.post} page={page} handleEdit={handleEdit}/>
            }

        </>
    );
}

