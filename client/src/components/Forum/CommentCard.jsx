import React, { useEffect,useState, memo } from 'react';
import styles from './CommentCard.module.css'
import CreateReply from './CreateReply';
import {simplifyDate} from '../../date';
import {useQueryClient} from "@tanstack/react-query";
import {FiEdit} from "react-icons/fi";
import {BsTrash3} from "react-icons/bs"
import { useProfile } from '../../context/ProfileContext';
import {useNavigate} from "react-router-dom";
import { usePostContext } from '../../context/PostContext';
import { useActivityContext } from '../../context/ActivityContext';

const CommentCard = ({index,comment,setPost,commentPage,handleReplyClick,openReplyIndex,postService,hasReply}) => {
    const queryClient = useQueryClient();
    const {selectedCommentType,setCommentID,selectedCommentID} = useActivityContext();
    const {selectedPostID} = usePostContext();
    const [targetCardEffect,setTargetCardEffect] = useState(selectedCommentType === "comment" && comment.id===selectedCommentID ? true : false);
    const [isEdit,setIsEdit] = useState(false);
    const [editedComment,setEditedComment] = useState("");
    const {nickname} = useProfile();
    const navigate = useNavigate();


    useEffect(()=>{
        if(targetCardEffect) {
            setTimeout(()=>{setTargetCardEffect(false);setCommentID(null)},2000);
        }
    },[comment])

    const handleText = (e) => {
        setEditedComment(e.target.value);
    }

    const handleDeleteConfirm = (text) => {
        const result = window.confirm(text);
        if(result) {
            postService.deleteComment(comment.post_id, comment.id)
                .then((result)=>{
                    queryClient.invalidateQueries(["comments", selectedPostID, commentPage]);
                })
        } 
    } 

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitEditedComment(e);
        }
    }

    const handleEdit = () => {
        setIsEdit((prev)=>!prev);
        setEditedComment(comment.body);
    }

    const submitEditedComment = (e) => {
        e.preventDefault();
        postService.updateComment(comment.post_id, comment.id, editedComment)
            .then((result)=>{
                queryClient.invalidateQueries(["comments", selectedPostID, commentPage]);
                setIsEdit((prev)=>!prev);
            })
    }

    const viewUserActivity = () => {
        navigate(`/view-user-activity/${comment.nickname}`)
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
                        <div className={styles.commentAuthor} onClick={viewUserActivity}>{comment.nickname}</div>
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
                <CreateReply setPost={setPost}
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
