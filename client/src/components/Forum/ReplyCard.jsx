import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import styles from './ReplyCard.module.css'
import CreateReply from './CreateReply';
import simplifyDate from '../../date';
import {PiArrowElbowDownRightBold} from "react-icons/pi";
import {useMutation,useQueryClient} from "@tanstack/react-query";
import { useProfile } from '../../context/ProfileContext';
import {FiEdit} from "react-icons/fi";
import {BsTrash3} from "react-icons/bs";
import ReactQuill, {Quill} from 'react-quill';
import './quill.css';

export default function ReplyCard ({index,reply,postID,commentPage,postPage,targetReplyID,setPost,handleReplyClick,openReplyIndex,commentID,isFirst,postService})  {
    const queryClient = useQueryClient();
    const [isEdit,setIsEdit] = useState(false);
    const [targetCardEffect,setTargetCardEffect] = useState(reply.id===targetReplyID);
    const [editedReply,setEditedReply] = useState("");
    const {nickname} = useProfile();
    const quillRef = useRef();

    useEffect(()=>{
        if(targetCardEffect) {
            setTimeout(()=>{setTargetCardEffect(false);},5000);
        }
    },[])

    const handleText = (contents) => {
        setEditedReply(contents);
    }

    const handleConfirm = (text) => {
        const result = window.confirm(text);
        if(result) {
            postService.deleteReply(reply.post_id, reply.reply_parent_id, reply.id)
                .then((result)=>{
                    queryClient.invalidateQueries(["comments", postID, commentPage]);
                })
        } 
    } 

    const handleEdit = () => {
        setIsEdit((prev)=>!prev);
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


    const submitEditedReply = (e) => {
        e.preventDefault();
        postService.updateReply(reply.post_id, reply.reply_parent_id, reply.id, editedReply)
            .then((result)=>{
                queryClient.invalidateQueries(["comments", postID, commentPage]);
                setIsEdit((prev)=>!prev);
            })
    }

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
                        <div className={styles.replyAuthor}>{reply.nickname}</div>
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
                    {reply.nickname === nickname && !isEdit && 
                    <div className={styles.editContainer}>
                        <FiEdit className={styles.editIcon} onClick={handleEdit}/>
                        <BsTrash3 className={styles.trashIcon} onClick={()=>{handleConfirm(`Do you want to delete this reply?`)}}/>
                    </div>}
            </div>}
            {openReplyIndex === index && 
                    <CreateReply author={"@"+reply.nickname} 
                                postPage={postPage}
                                setPost={setPost}
                                commentPage={commentPage}
                                postID = {postID} 
                                commentID ={commentID} 
                                postService={postService} 
                                handleReplyClick={handleReplyClick}
                                custom={true}/>    
                    }
        </>
    );
}
