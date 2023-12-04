import React, { useEffect, useState } from 'react';
import styles from './ActivityComments.module.css';
import useActivityCommentPage, {useUserCommentsData } from '../../hooks/useActivityComment';
import ActivityCommentCard from './ActivityCommentCard';
import LoadingSpinner from '../Loader/LoadingSpinner';
import Alarm from '../Alarm/Alarm';
import { useMyProfileData } from '../../hooks/useMyProfileData';

const COMMENTSPERPAGE = 10;

export default function ActivityComments({userNickname}) {
    const [selectedCard,setSelectedCard] = useState(window.history.state.my_comments ? window.history.state.my_comments : null);
    const [currentPage, setCurrentPage] = useState(selectedCard ? Math.ceil(selectedCard/COMMENTSPERPAGE) : 1);
    const {data:profileData} = useMyProfileData();
    const {totalPage,
            startPage,
            endPage,
            hasPrev,
            hasNext,
            handlePrevious,
            handleNext,
            handlePage,
            setPageInfo} = useActivityCommentPage();
    const {data,
            isFetching,
            isError} = useUserCommentsData(userNickname ? userNickname : profileData?.nickname, currentPage);

    useEffect(()=>{
        if(data) {
            if(selectedCard) setPageInfo(data.total_comments,Math.ceil(selectedCard/COMMENTSPERPAGE));
            else setPageInfo(data.total_comments,currentPage);
        } 
    },[data, currentPage, selectedCard, setPageInfo])

    const customHandlePrevious = () => {
        handlePrevious(setCurrentPage);
    }

    const customHandleNext = () => {
        handleNext(setCurrentPage);
    }

    const customHandlePage = (startPage,index) => {
        handlePage(startPage,index,setCurrentPage)
    }

    if(isFetching) {
        return (
            <div className={styles.container}>
                <div className={styles.infoContainer}>
                    <span className={styles.infoNum}>No.</span>
                    <span className={styles.infoComment}>Comment</span>
                    <span className={styles.infoCreatedDate}>Created Date</span>
                </div>
                <div className={styles.loadingSpinnerContainer}>
                    <LoadingSpinner/>
                </div>
            </div>
        )
    }

    if(isError) {
        return (
            <div className={styles.container}>
                <div className={styles.infoContainer}>
                    <span className={styles.infoNum}>No.</span>
                    <span className={styles.infoComment}>Comment</span>
                    <span className={styles.infoCreatedDate}>Created Date</span>
                </div>
                <Alarm message={"Something went wrong..."}/>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <span className={styles.infoNum}>No.</span>
                <span className={styles.infoComment}>Comment</span>
                <span className={styles.infoCreatedDate}>Created Date</span>
            </div>
            {data?.my_comments.length === 0 && <div className={styles.noContent}> <span>No Comments</span> </div>}
            {data?.my_comments.map((comment,index)=><ActivityCommentCard key={index} 
                                                                    comment={comment} 
                                                                    num={(currentPage-1)*COMMENTSPERPAGE+(index+1)}
                                                                    selectedCard={selectedCard}
                                                                    setSelectedCard={setSelectedCard}
                                                                    />)}
            {data?.my_comments.length > 0 && totalPage && 
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

