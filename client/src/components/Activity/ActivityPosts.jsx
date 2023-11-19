import React, { useEffect, useState } from 'react';
import styles from './ActivityPosts.module.css';
import MyPostCard from './ActivityPostCard';
import useActivityPostPage, { useUserPostsData } from '../../hooks/useActivityPost';
import Alarm from '../Alarm/Alarm';
import LoadingSpinner from '../Loader/LoadingSpinner';
import { useMyProfileData } from '../../hooks/useMyProfileData';

const POSTSPERPAGE = 10;
export default function ActivityPosts({userNickname}) {
    const [selectedCard,setSelectedCard] = useState(window.history.state.my_posts ? window.history.state.my_posts : null);
    const [currentPage, setCurrentPage] = useState(selectedCard ? Math.ceil(selectedCard/POSTSPERPAGE) : 1);
    const {data:profileData} = useMyProfileData();
    window.history.state.my_posts && console.log(window.history.state)
    const {
        totalPage,
        startPage,
        endPage,
        hasPrev,
        hasNext,
        handlePrevious,
        handleNext,
        handlePage,
        setPageInfo,
    } = useActivityPostPage();

    const {
        data,
        isFetching,
        isError,
    } = useUserPostsData(userNickname ? userNickname : profileData?.nickname, currentPage);

    useEffect(()=>{
        if(data) {
            if(selectedCard) setPageInfo(data.total_posts,Math.ceil(selectedCard/POSTSPERPAGE));
            else setPageInfo(data.total_posts,currentPage);
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

    if(isFetching) {
        return (
            <div className={styles.container}>
                <div className={styles.infoContainer}>
                    <span className={styles.infoNum}>No.</span>
                    <span className={styles.infoTitle}>Title</span>
                    <span className={styles.infoCreatedDate}>Created Date</span>
                    <span className={styles.infoView}>Views</span>
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
                    <span className={styles.infoTitle}>Title</span>
                    <span className={styles.infoCreatedDate}>Created Date</span>
                    <span className={styles.infoView}>Views</span>
                </div>
                <Alarm message={"Something went wrong..."}/>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <span className={styles.infoNum}>No.</span>
                <span className={styles.infoTitle}>Title</span>
                <span className={styles.infoCreatedDate}>Created Date</span>
                <span className={styles.infoView}>Views</span>
            </div>
            {data && !data.my_posts && <div className={styles.noContent}> <span>No Posts</span> </div>}
            {data && data.my_posts.map((post,index)=><MyPostCard key={index} 
                                                        post={post} 
                                                        num={(currentPage-1)*POSTSPERPAGE+(index+1)}
                                                        selectedCard={selectedCard}
                                                        setSelectedCard={setSelectedCard}/>)}
            {data && data.my_posts && totalPage &&
            <footer>          
                <nav className={styles.nav}>
                    {hasPrev && 
                    <button className={styles.btn} onClick={customHandlePrevious}> 
                        {"<<"}
                    </button>}
                    {data.my_posts.length > 0 && 
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

