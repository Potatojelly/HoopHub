import React, { useState } from 'react';
import styles from './MyComments.module.css'
import MyCommentCard from "../MyActivity/MyCommentCard";
import useMyComment from '../../hooks/useMyComment';

const COMMENTSPERPAGE = 10;
export default function MyComments({postService}) {
    const [selectedCard,setSelectedCard] = useState(window.history.state.my_comments ? window.history.state.my_comments : null);
    const {
        comments,
        currentPage,
        totalComments,
        startPage,
        endPage,
        hasPrev,
        hasNext,
        handlePrevious,
        handleNext,
        handlePage
    } = useMyComment(postService,selectedCard ? Math.ceil(selectedCard/COMMENTSPERPAGE) : null);
    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <span className={styles.infoNum}>No.</span>
                <span className={styles.infoComment}>Comment</span>
                <span className={styles.infoCreatedDate}>Created Date</span>
            </div>
            {!comments && <div className={styles.noContent}> <span>No Comments</span> </div>}
            {comments && comments.map((comment,index)=><MyCommentCard key={index} 
                                                                    comment={comment} 
                                                                    num={(currentPage-1)*COMMENTSPERPAGE+(index+1)}
                                                                    selectedCard={selectedCard}
                                                                    setSelectedCard={setSelectedCard}
                                                                    />)}
            {comments && 
            <footer>          
                <nav className={styles.nav}>
                    {hasPrev && 
                    <button className={styles.btn} onClick={()=>{handlePrevious(); setSelectedCard(null)}}> 
                        {"<<"}
                    </button>}
                    {comments.length > 0 && 
                        Array(endPage-startPage+1)
                        .fill()
                        .map(( _,index) => 
                            (
                                <button className={styles.btn} 
                                        key={index} 
                                        onClick={()=>{handlePage(startPage,index); setSelectedCard(null)}} 
                                        aria-current={currentPage === startPage+index ? "selected" : null}>
                                    {(startPage+index)}
                                </button>
                            )
                        )
                    }
                    {hasNext && <button  className={styles.btn} onClick={()=>{handleNext(); setSelectedCard(null)}}> 
                        {">>"}
                    </button>}
                </nav>                
            </footer>}
        </div>
    );
}

