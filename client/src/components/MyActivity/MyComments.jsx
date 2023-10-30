import React, { useEffect, useState } from 'react';
import styles from './MyComments.module.css'
import MyCommentCard from "../MyActivity/MyCommentCard";
import useMyComment, { useMyCommentQuery } from '../../hooks/useMyComment';

const COMMENTSPERPAGE = 10;
export default function MyComments({postService}) {
    const [selectedCard,setSelectedCard] = useState(window.history.state.my_comments ? window.history.state.my_comments : null);
    const [currentPage, setCurrentPage] = useState(selectedCard ? Math.ceil(selectedCard/COMMENTSPERPAGE) : 1);
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
    } = useMyComment();

    const {
        data,
        isFetching,
    } = useMyCommentQuery(currentPage);

    useEffect(()=>{
        if(data) {
            if(selectedCard) setPageInfo(data.total_comments,Math.ceil(selectedCard/COMMENTSPERPAGE));
            else setPageInfo(data.total_comments,currentPage);
        } 
    },[data])

    const customHandlePrevious = () => {
        handlePrevious(setCurrentPage);
    }

    const customHandleNext = () => {
        handleNext(setCurrentPage);
    }

    const customHandlePage = (startPage,index) => {
        handlePage(startPage,index,setCurrentPage)
    }


    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <span className={styles.infoNum}>No.</span>
                <span className={styles.infoComment}>Comment</span>
                <span className={styles.infoCreatedDate}>Created Date</span>
            </div>
            {data && !data.my_comments && <div className={styles.noContent}> <span>No Comments</span> </div>}
            {data && data.my_comments.map((comment,index)=><MyCommentCard key={index} 
                                                                    comment={comment} 
                                                                    num={(currentPage-1)*COMMENTSPERPAGE+(index+1)}
                                                                    selectedCard={selectedCard}
                                                                    setSelectedCard={setSelectedCard}
                                                                    />)}
            {data && data.my_comments && totalPage && 
            <footer>          
                <nav className={styles.nav}>
                    {hasPrev && 
                    <button className={styles.btn} onClick={customHandlePrevious}> 
                        {"<<"}
                    </button>}
                    {data && data.my_comments.length > 0 && 
                        Array(endPage-startPage+1)
                        .fill()
                        .map(( _,index) => 
                            (
                                <button className={styles.btn} 
                                        key={index} 
                                        onClick={()=>{customHandlePage(startPage,index)}} 
                                        aria-current={currentPage === startPage+index ? "selected" : null}>
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

