import React, { forwardRef, useEffect, useRef, useState, memo } from 'react';
import styles from './CommentCard.module.css'
import CreateReply from './CreateReply';
import Reply from './ReplyCard';
import simplifyDate from '../../date';
import {useMutation,useQueryClient} from "@tanstack/react-query";
import {v4 as uuidv4} from "uuid";
import {FiEdit} from "react-icons/fi";
import {BsTrash3} from "react-icons/bs"
import { useProfile } from '../../context/ProfileContext';

const CommentCard = ({index,comment,postID,postPage,setPost,commentPage,targetCommentID,handleReplyClick,openReplyIndex,postService,hasReply}) => {
    const queryClient = useQueryClient();
    const [targetCardEffect,setTargetCardEffect] = useState(comment.id===targetCommentID);
    const [isEdit,setIsEdit] = useState(false);
    const [editedComment,setEditedComment] = useState("");
    const {nickname} = useProfile();

    useEffect(()=>{
        if(targetCardEffect) {
            setTimeout(()=>{setTargetCardEffect(false);},5000);
        }
    },[])

    const handleText = (e) => {
        setEditedComment(e.target.value);
    }

    const handleDeleteConfirm = (text) => {
        const result = window.confirm(text);
        if(result) {
            postService.deleteComment(comment.post_id, comment.id)
                .then((result)=>{
                    queryClient.invalidateQueries(["comments", postID, commentPage]);
                })
        } 
    } 

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitEditedComment();
        }
    }

    const handleEdit = () => {
        setIsEdit((prev)=>!prev);
        setEditedComment(comment.body);
    }

    const submitEditedComment = () => {
        postService.updateComment(comment.post_id, comment.id, editedComment)
            .then((result)=>{
                queryClient.invalidateQueries(["comments", postID, commentPage]);
                setIsEdit((prev)=>!prev);
            })
    }


    return (
        <>
            {comment.deleted === 1 && 
            <li className={`${styles.deletedCommentCard} ${hasReply && styles.deletedCommentCardWithReply}`}>
                <span>Deleted Comment</span>
            </li>}
            {comment.deleted !== 1 &&    
                <li className={`${styles.commentCard} ${hasReply && styles.commentCardWithReply} ${targetCardEffect && styles.targetCard}`}>
                <div className={styles.comment}>
                    <div className={styles.profileContainer}>
                        <img className={styles.profileImg} src={comment.image_url} alt="userImg" />
                    </div>
                    <div className={styles.commentSubContainer}>
                        <div className={styles.commentAuthor}>{comment.nickname}</div>
                        {!isEdit && <div className={styles.commentText}>{comment.body}</div>}
                        {isEdit && <form className={styles.commentEdit}>
                                        <textarea className={styles.commentTextEdit}
                                                    value={editedComment}
                                                    onChange={handleText}
                                                    onKeyDown={handleKeyPress}/>
                                        <button className={styles.cancelBtn} type="button" onClick={handleEdit}>Cancel</button>
                                        <button className={styles.editBtn} type="submit" onClick={submitEditedComment}>Edit</button>
                                    </form>}
                        <div className={styles.commentAction}>
                            <small className={styles.commentTime}> {simplifyDate(comment.comment_created_at)} </small>
                            <small className={styles.replyBtn} onClick={handleReplyClick}> Reply</small>
                        </div>
                    </div>
                    {comment.nickname === nickname && !isEdit && <div className={styles.editContainer}>
                        <FiEdit className={styles.editIcon} onClick={handleEdit}/>
                        <BsTrash3 className={styles.trashIcon} onClick={()=>{handleDeleteConfirm(`Do you want to delete this comment?`)}}/>
                    </div>}
                </div>
                {openReplyIndex === index && 
                <CreateReply postID={comment.post_id} 
                            postPage={postPage}
                            setPost={setPost}
                            commentPage={commentPage}
                            commentID={comment.id} 
                            postService={postService} 
                            handleReplyClick={handleReplyClick}/> 
                }
            </li>}
        </>
    );
}

export default memo(CommentCard);
