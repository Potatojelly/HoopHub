import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './ReplyCard.module.css'
import CreateReply from './CreateReply';
import {simplifyDate} from '../../date';
import {PiArrowElbowDownRightBold} from "react-icons/pi";
import {useQueryClient} from "@tanstack/react-query";
import {FiEdit} from "react-icons/fi";
import {BsTrash3} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import ReactQuill from 'react-quill';
import './quill.css';
import { useActivityContext } from '../../context/ActivityContext';
import { usePostContext } from '../../context/PostContext';
import { useDeleteReply, useUpdateReply } from '../../hooks/useCommentsData';
import Alarm from '../Alarm/Alarm';
import { useMyProfileData } from '../../hooks/useMyProfileData';

export default function ReplyCard ({index,reply,handleReplyClick,selectedPostID,openReplyIndex,commentID,isFirst})  {
    const queryClient = useQueryClient();
    // const {selectedPostID} = usePostContext();
    const {selectedCommentType,setCommentID, selectedCommentID} = useActivityContext();
    const [isEdit,setIsEdit] = useState(false);
    const [isError,setIsError] = useState(false);
    const [targetCardEffect,setTargetCardEffect] = useState(selectedCommentType === "reply" && reply.id===selectedCommentID ? true : false);
    const [editedReply,setEditedReply] = useState("");
    const {data:profileData} = useMyProfileData();
    const {mutate: deleteReply} = useDeleteReply();
    const {mutate: updateReply} = useUpdateReply();
    const quillRef = useRef();
    const navigate = useNavigate();

    useEffect(()=>{
        if(targetCardEffect) {
            setTimeout(()=>{setTargetCardEffect(false); setCommentID(null)},2000);
        }
    },[reply])

    const handleText = (contents) => {
        setEditedReply(contents);
    }

    const handleDelete = (text) => {
        const result = window.confirm(text);
        if(result) {
            deleteReply({selectedPostID, commentID:reply.reply_parent_id, replyID:reply.id},{
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

    const submitEditedReply = (e) => {
        e.preventDefault();
        updateReply({selectedPostID, commentID:reply.reply_parent_id, replyID:reply.id, editedReply},{
            onSuccess: () => {
                queryClient.invalidateQueries(["comments"]);
            },
            onError: () => {
                setIsError(true);
                setTimeout(()=>{setIsError(false)},4000);
            }
        })
    }

    const handleEdit = () => {
        setIsEdit((prev)=>!prev);
    }

    const viewUserActivity = () => {
        if(profileData?.nickname === reply.nickname) {
            navigate(`/manage-my-activity`);
            return;
        }
        navigate(`/view-user-activity/${reply.nickname}`)
    }

    useEffect(()=>{
        if(isEdit) {
            setEditedReply(reply.body);
            const editor = quillRef.current.getEditor(); 
            const delta = editor.clipboard.convert(reply.body);
            editor.keyboard.bindings[13].unshift({
                key: 13,
                handler: (range, context) => {
                    document.getElementById('submitButton').click();
                    return false;
                }
            });
            editor.setContents(delta);
        }
    },[isEdit])


    const modules = useMemo(()=> {
        return {
            toolbar: false,
        }
    },[]);


    return (
        <>
            {reply.deleted === 1 &&  
            <div className={`${styles.deletedreply} ${isFirst && styles.deletedfirstReply}`}>
                Deleted Reply
            </div>}
            {reply.deleted !== 1 && 
            <div className={`${styles.reply} ${isFirst && styles.firstReply} ${targetCardEffect && styles.targetCard}`}>
                    <PiArrowElbowDownRightBold/>
                    <div className={styles.profileContainer}>
                        <img className={styles.profileImg} src={reply.image_url} alt="userImg" />
                    </div>
                    <div className={styles.replySubContainer}>
                        <div className={styles.replyAuthor} onClick={viewUserActivity}>{reply.nickname}</div>
                        {!isEdit && <div className={styles.replyText} dangerouslySetInnerHTML={{ __html: reply.body }}/>}
                        {isEdit && <form className={styles.commentEdit}>
                                        <ReactQuill className={"replyEdit"}
                                                    ref={quillRef}
                                                    onChange={handleText}
                                                    modules={modules}/>
                                        <button className={styles.cancelBtn} type="button" onClick={handleEdit}>Cancel</button>
                                        <button className={styles.editBtn} type="submit" id="submitButton" onClick={submitEditedReply}>Edit</button>
                                    </form>}
                        <small className={styles.replyTime}> {simplifyDate(reply.reply_created_at)} </small>
                        <small className={styles.replyBtn} onClick={handleReplyClick}>Reply</small>
                    </div>
                    {reply.nickname === profileData?.nickname && !isEdit && 
                    <div className={styles.editContainer}>
                        <FiEdit className={styles.editIcon} onClick={handleEdit}/>
                        <BsTrash3 className={styles.trashIcon} onClick={()=>{handleDelete(`Do you want to delete this reply?`)}}/>
                    </div>}
            </div>}
            {openReplyIndex === index && 
                    <CreateReply author={"@"+reply.nickname} 
                                commentID ={commentID} 
                                handleReplyClick={handleReplyClick}
                                custom={true}/>    
                    }
            {isError && <Alarm message={"Something went wrong..."}/>}
        </>
    );
}
