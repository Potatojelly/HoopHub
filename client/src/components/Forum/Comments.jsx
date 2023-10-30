import React, { useEffect, useRef, useState } from 'react';
import styles from './Comments.module.css'
import CommentCard from './CommentCard';
import {v4 as uuidv4} from "uuid";
import useComment, { useCommentQuery } from '../../hooks/useComment';
import ReplyCard from './ReplyCard';
import { useProfile } from '../../context/ProfileContext';
import {useQueryClient} from "@tanstack/react-query";
import { usePostContext } from '../../context/PostContext';
import { useMyActivityContext } from '../../context/MyActivityContext';

export default function Comments({setPost, targetCommentID,  postService}) {
    const {setSelectedPage,selectedPage,selectedPostID} = usePostContext();
    const {selectedCommentID,selectedCommentPage} = useMyActivityContext();
    const [currentPage, setCurrentPage] = useState(selectedCommentPage ? selectedCommentPage : 1);
    const queryClient = useQueryClient();
    const {nickname} = useProfile();
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
    } = useComment();

    const {
        data,
        isFetching,
    } = useCommentQuery(currentPage,selectedPostID);

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
        postService.createComment(selectedPostID,commentText)
            .then((data)=>{
                if(data.success === true) {
                    postService.getPost(selectedPostID)
                        .then((result)=>{setPost(result.post)})
                        .catch((err)=>console.log(err))
                    queryClient.invalidateQueries(['posts', selectedPage]);
                    queryClient.invalidateQueries(["comments", selectedPostID, 1]);
                    // handlePage(currentPage,0,setCurrentPage);
                    setCommentText("");
                    setIsSubmitDisabled(true);
                }
            });
    }

    const customHandlePrevious = () => {
        handlePrevious(selectedPostID,setCurrentPage);
    }

    const customHandleNext = () => {
        handleNext(selectedPostID,setCurrentPage);
    }

    const customHandlePage = (startPage,index) => {
        handlePage(startPage,index,selectedPostID,setCurrentPage)
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
                {data && data.comments.map((comment,index)=>{
                    return comment.type === "comment" ?   
                    <CommentCard key={index}
                                index={(currentPage-1)*5+(index+1)} 
                                setPost={setPost}
                                comment={comment} 
                                commentPage={currentPage}
                                postService={postService} 
                                hasReply={(index !== data.comments.length-1 && comment.id === data.comments[index+1].reply_parent_id) ? true : false}
                                openReplyIndex={openReplyIndex}
                                handleReplyClick={() => onReply((currentPage-1)*5+(index+1))}
                                /> :
                    <ReplyCard key={index} 
                                index={(currentPage-1)*5+(index+1)}
                                setPost={setPost}
                                reply={comment} 
                                commentPage={currentPage}
                                commentID={comment.reply_parent_id} 
                                isFirst={(index !==0 && data.comments[index-1].type === "comment") ? true : false}
                                openReplyIndex={openReplyIndex}
                                handleReplyClick={() => onReply((currentPage-1)*5+(index+1))}
                                postService={postService}/>
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

