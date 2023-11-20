import React, { useEffect,useState, memo } from 'react';
import styles from './CommentCard.module.css'
import CreateReply from './CreateReply';
import {simplifyDate} from '../../date';
import {useQueryClient} from "@tanstack/react-query";
import {FiEdit} from "react-icons/fi";
import {BsTrash3} from "react-icons/bs"
import {useNavigate} from "react-router-dom";
import { useActivityContext } from '../../context/ActivityContext';
import { useDeleteComment, useUpdateComment } from '../../hooks/useCommentsData';
import Alarm from '../Alarm/Alarm';
import { useMyProfileData } from '../../hooks/useMyProfileData';

const CommentCard = ({index,comment,selectedPostID,handleReplyClick,openReplyIndex,hasReply}) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {selectedCommentType,setCommentID,selectedCommentID} = useActivityContext();
    const [targetCardEffect,setTargetCardEffect] = useState(selectedCommentType === "comment" && comment.id===selectedCommentID ? true : false);
    const [isError,setIsError] = useState(false);
    const [isEdit,setIsEdit] = useState(false);
    const [editedComment,setEditedComment] = useState("");
    const {data:profileData} = useMyProfileData();
    const {mutate: deleteComment} = useDeleteComment();
    const {mutate: updateComment} = useUpdateComment();

    useEffect(()=>{
        if(targetCardEffect) {
            setTimeout(()=>{setTargetCardEffect(false);setCommentID(null)},2000);
        }
    },[targetCardEffect,setCommentID])

    const submitEditedComment = (e) => {
        e.preventDefault();
        updateComment({selectedPostID, commentID:comment.id, editedComment},{
            onSuccess: () => {
                queryClient.invalidateQueries(["comments"]);
                setIsEdit((prev)=>!prev);
            },
            onError: () => {
                setIsError(true);
                setTimeout(()=>{setIsError(false)},4000);
            }
        })
    }

    const handleDeleteConfirm = (text) => {
        const result = window.confirm(text);
        if(result) {
            deleteComment({selectedPostID, commentID:comment.id},{
                onSuccess: () => {
                    queryClient.invalidateQueries(["comments"]);
                },
                onError: () => {
                    setIsError(true);
                    setTimeout(()=>{setIsError(false)},4000);
                }
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

    const viewUserActivity = () => {
        if(profileData?.nickname === comment.nickname) {
            navigate(`/manage-my-activity`)
            return
        }
        navigate(`/view-user-activity/${comment.nickname}`)
    }

    const handleText = (e) => {
        setEditedComment(e.target.value);
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
                    {comment.nickname === profileData?.nickname && !isEdit && <div className={styles.editContainer}>
                        <FiEdit className={styles.editIcon} onClick={handleEdit}/>
                        <BsTrash3 className={styles.trashIcon} onClick={()=>{handleDeleteConfirm(`Do you want to delete this comment?`)}}/>
                    </div>}
                </div>
                {openReplyIndex === index && 
                <CreateReply commentID={comment.id} 
                            selectedPostID={selectedPostID}
                            handleReplyClick={handleReplyClick}/> 
                }
            </li>}
            {isError && <Alarm message={"Something went wrong..."}/>}
        </>
    );
}

export default memo(CommentCard);
