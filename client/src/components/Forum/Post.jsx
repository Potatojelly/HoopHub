import React, { useEffect, useState } from 'react';
import styles from './Post.module.css'
import Comments from './Comments';
import {simplifyDate} from '../../date';
import {FaRegCommentAlt} from "react-icons/fa";
import {useQueryClient} from "@tanstack/react-query";
import {BsFillEyeFill} from "react-icons/bs";
import {FiEdit} from "react-icons/fi";
import {BsTrash3} from "react-icons/bs"
import {useNavigate, useParams } from "react-router-dom";
import PostEditor from './PostEditor';
import { usePostContext } from '../../context/PostContext';
import { useDeletePost, usePostData } from '../../hooks/usePostsData';
import { useMyProfileData } from '../../hooks/useMyProfileData';
import LoadingSpinner from '../Loader/LoadingSpinner';


export default function Post() {
    const {postNum} = useParams();
    const {setSelectedPage,setSelectedPostID,selectedPage,selectedPostID} = usePostContext();
    const [isEdit,setIsEdit] = useState(false);
    const {data: profileData} = useMyProfileData();
    const {data: postData,isFetching} = usePostData(parseInt(postNum));
    const {mutate: deletePost} = useDeletePost();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    console.log(postData);

    useEffect(()=>{
        if(selectedPostID && selectedPage) {
            console.log("?")
            const postInfo = { selectedPage, selectedPostID};
            localStorage.setItem('postInfo', JSON.stringify(postInfo));
        } else {
            const storedPostInfo = JSON.parse(localStorage.getItem('postInfo'));
            console.log(storedPostInfo.selectedPage);
            console.log(storedPostInfo.selectedPostID);
            setSelectedPage(1);
            setSelectedPostID(39);
        }
    },[])

    const handleConfirm = (text) => {
        const result = window.confirm(text);
        if(result) {
            deletePost(selectedPostID,{
                onSuccess: () => {
                    queryClient.invalidateQueries(['posts', selectedPage]);
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
                {selectedPostID && <Comments/>}
                {/* <Comments setPost={setPost} postService={postService}/> */}
            </div>
        }
            {isEdit &&
                <PostEditor post={postData.post} handleEdit={handleEdit}/>
            }
        </>
    );
}

