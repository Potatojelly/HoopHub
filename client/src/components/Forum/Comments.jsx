import React, { useEffect, useRef, useState } from 'react';
import styles from './Comments.module.css'
import CommentCard from './CommentCard';
import {v4 as uuidv4} from "uuid";
import { useCommentsData, useCreateComment } from '../../hooks/useCommentsData';
import ReplyCard from './ReplyCard';
import { useProfile } from '../../context/ProfileContext';
import {useQueryClient} from "@tanstack/react-query";
import { usePostContext } from '../../context/PostContext';
import { useActivityContext } from '../../context/ActivityContext';
import { useMyProfileData } from '../../hooks/useMyProfileData';
import useCommentPage from '../../hooks/useCommentsData';
import LoadingSpinner from '../Loader/LoadingSpinner';

export default function Comments() {
    const {selectedPostID} = usePostContext();
    const {selectedCommentPage} = useActivityContext();
    const [currentPage, setCurrentPage] = useState(selectedCommentPage ? selectedCommentPage : 1);
    const queryClient = useQueryClient();
    const {data: profileData} = useMyProfileData();
    const {mutate: createComment} = useCreateComment();
    const [commentText,setCommentText] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [openReplyIndex, setOpenReplyIndex] = useState(null);

    const {
        totalPage,
        startPage,
        endPage,
        hasPrev,
        hasNext,
        handlePrevious,
        handleNext,
        handlePage,
        setPageInfo
    } = useCommentPage();

    const {
        data,
        isFetching,
    } = useCommentsData(currentPage,selectedPostID);

    useEffect(()=>{
        if(data) {
            setPageInfo(data.total_comments,currentPage);
        } 
    },[data])

    const onReply = (index) => {
        if (openReplyIndex === index) {
            setOpenReplyIndex(null); 
        } else {
            setOpenReplyIndex(index); 
        };
    }

    const handleComment = (e) => {
        const text = e.target.value
        setCommentText(e.target.value);
        setIsSubmitDisabled(text === "");
    }

    const submitComment = (e) => {
        e.preventDefault();
        createComment({selectedPostID,commentText}, {
            onSuccess: () => {
                queryClient.invalidateQueries(['post', selectedPostID]);
                queryClient.invalidateQueries(['posts']);
                queryClient.invalidateQueries(["comments"]);
                const contentElement = document.querySelector('#cmts');
                contentElement.scrollIntoView({ behavior: 'smooth' });
                setCommentText("");
                setIsSubmitDisabled(true);
            }
        })
    }

    const customHandlePrevious = () => {
        handlePrevious(selectedPostID,setCurrentPage);
    }

    const customHandleNext = () => {
        handleNext(selectedPostID,setCurrentPage);
    }

    const customHandlePage = (startPage,index) => {
        handlePage(startPage,index,selectedPostID,setCurrentPage)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitComment(e);
        }
    }

    return (
        <div>
            <form className={styles.comment} onSubmit={submitComment}>
                <small>{`Comment as `}    
                    <span className={styles.commentName}> {profileData?.nickname}</span>
                </small>
                <textarea className={styles.commentContent} 
                        value={commentText} 
                        placeholder='Please leave a comment.'
                        onKeyDown={handleKeyPress}
                        onChange={handleComment}/>
                <button className={styles.commentBtn} disabled={isSubmitDisabled}>Comment</button>
            </form>
            <span id="cmts">Comments</span>
            <ul className={styles.commentsContainer}>
                {isFetching && <div className={styles.loadingSpinner}><LoadingSpinner/> </div>}
                {!isFetching && data && data.comments.map((comment,index)=>{
                    return comment.type === "comment" ?   
                    <CommentCard key={index}
                                index={(currentPage-1)*5+(index+1)} 
                                comment={comment} 
                                hasReply={(index !== data.comments.length-1 && comment.id === data.comments[index+1].reply_parent_id) ? true : false}
                                openReplyIndex={openReplyIndex}
                                handleReplyClick={() => onReply((currentPage-1)*5+(index+1))}
                                /> :
                    <ReplyCard key={index} 
                                index={(currentPage-1)*5+(index+1)}
                                reply={comment} 
                                commentID={comment.reply_parent_id} 
                                isFirst={(index !==0 && data.comments[index-1].type === "comment") ? true : false}
                                openReplyIndex={openReplyIndex}
                                handleReplyClick={() => onReply((currentPage-1)*5+(index+1))}/>
                })}
            </ul>
            {data && data.comments && 
            <footer>          
                <nav className={styles.nav}>
                    {hasPrev && 
                    <button className={styles.btn} onClick={customHandlePrevious}> 
                        {"<<"}
                    </button>}
                    {data && data.comments.length > 0 && totalPage &&
                        Array(endPage-startPage+1)
                        .fill()
                        .map(( _,index) => 
                            (
                                <button className={styles.btn} 
                                        key={uuidv4()} 
                                        onClick={()=>{customHandlePage(startPage,index)}} 
                                        aria-current={currentPage === startPage+index ? "page" : null}>
                                    {(startPage+index)}
                                </button>
                            )
                        )
                    }
                    {hasNext && <button  className={styles.btn} onClick={customHandleNext}> 
                        {">>"}
                    </button>}
                </nav>                
            </footer>}
        </div>
    );
}

