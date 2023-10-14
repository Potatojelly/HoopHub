import React, { useEffect, useRef, useState } from 'react';
import styles from './Comments.module.css'
import CommentCard from './CommentCard';
import {v4 as uuidv4} from "uuid";
import useComment from '../../hooks/useComment';
import ReplyCard from './ReplyCard';
import { useProfile } from '../../context/ProfileContext';
import {useQueryClient} from "@tanstack/react-query";

const COMMENTSPERPAGE = 5;
export default function Comments({postID, postPage, setPost, targetPage, targetCommentID,  postService}) {
    const queryClient = useQueryClient();
    const {nickname} = useProfile();
    const [commentText,setCommentText] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [openReplyIndex, setOpenReplyIndex] = useState(null);

    const {
        comments,
        currentPage,
        postTotalComments,
        totalComments,
        startPage,
        endPage,
        hasPrev,
        hasNext,
        handlePrevious,
        handleNext,
        handlePage
    } = useComment(postService, postID, targetPage);

    

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
        postService.createComment(postID,commentText)
            .then((data)=>{
                if(data.success === true) {
                    postService.getPost(postID)
                        .then((result)=>{setPost(result.post)})
                        .catch((err)=>console.log(err))
                    queryClient.invalidateQueries(['posts', postPage]);
                    queryClient.invalidateQueries(["comments", postID, 1]);
                    handlePage(startPage,0);
                    setCommentText("");
                    setIsSubmitDisabled(true);
                }
            });
    }

    // comments && console.log(comments);

    const movePage = (startPage,index) => {
        handlePage(startPage,index)
        const contentElement = document.querySelector('#cmts');
        contentElement.scrollIntoView({ behavior: 'smooth' });
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
                    <span className={styles.commentName}> {nickname}</span>
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
                {comments && comments.map((comment,index)=>{
                    return comment.type === "comment" ?   
                    <CommentCard key={index}
                                index={(currentPage-1)*5+(index+1)} 
                                setPost={setPost}
                                comment={comment} 
                                postID={postID}
                                postPage={postPage}
                                commentPage={currentPage}
                                postService={postService} 
                                hasReply={(index !== comments.length-1 && comment.id === comments[index+1].reply_parent_id) ? true : false}
                                openReplyIndex={openReplyIndex}
                                targetCommentID={targetCommentID}
                                handleReplyClick={() => onReply((currentPage-1)*5+(index+1))}
                                /> :
                    <ReplyCard key={index} 
                                index={(currentPage-1)*5+(index+1)}
                                setPost={setPost}
                                reply={comment} 
                                postPage={postPage}
                                commentPage={currentPage}
                                postID={comment.post_id} 
                                commentID={comment.reply_parent_id} 
                                isFirst={(index !==0 && comments[index-1].type === "comment") ? true : false}
                                openReplyIndex={openReplyIndex}
                                targetReplyID={targetCommentID}
                                handleReplyClick={() => onReply((currentPage-1)*5+(index+1))}
                                postService={postService}/>
                })}
            </ul>
            {comments && 
            <footer>          
                <nav className={styles.nav}>
                    {hasPrev && 
                    <button className={styles.btn} onClick={handlePrevious}> 
                        {"<<"}
                    </button>}
                    {comments.length > 0 && 
                        Array(endPage-startPage+1)
                        .fill()
                        .map(( _,index) => 
                            (
                                <button className={styles.btn} 
                                        key={uuidv4()} 
                                        onClick={()=>{movePage(startPage,index)}} 
                                        aria-current={currentPage === startPage+index ? "page" : null}>
                                    {(startPage+index)}
                                </button>
                            )
                        )
                    }
                    {hasNext && <button  className={styles.btn} onClick={handleNext}> 
                        {">>"}
                    </button>}
                </nav>                
            </footer>}
        </div>
    );
}

