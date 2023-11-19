import React, { useEffect, useState } from 'react';
import styles from './Posts.module.css'
import PostCard from './PostCard';
import { usePostPage, usePostsData  } from '../../hooks/usePostsData';
import { usePostContext } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Loader/LoadingSpinner';
import {useLocation  } from "react-router-dom";
const POSTSPERPAGE = 5;

function Posts({keyword}) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get("page"));
    const {user} = useAuth();
    const {selectedPostID,selectedPage,setSelectedPage,setSelectedPostID} = usePostContext();
    const [currentPage, setCurrentPage] = useState(page ? page : 1);
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
    } = usePostPage();

    const {
        data,
        isFetching,
    } = usePostsData(currentPage,keyword ? keyword : null);


    useEffect(()=>{
        if(data) {
            if(selectedPostID) setPageInfo(data.total_posts,selectedPage);
            else setPageInfo(data.total_posts,currentPage);
        } 
    },[data])

    useEffect(()=>{
        if(!user) {
            setSelectedPage(null);
            setSelectedPostID(null);
        }
    },[])

    const handleSelection = (postID) => {
        setSelectedPostID(postID);
        setSelectedPage(currentPage);
    }

    const customHandlePrevious = () => {
        handlePrevious(setCurrentPage,setSelectedPage);
    }

    const customHandleNext = () => {
        handleNext(setCurrentPage,setSelectedPage);

    }

    const customHandlePage = (startPage,index) => {
        handlePage(startPage,index,setCurrentPage,setSelectedPage)
    }
    return (
        <div className={styles.posts}>
            <h1 className={styles.title}>Posts</h1>
            <div className={styles.postsContainer}>
                <div className={styles.postsSubContainer}>
                    {isFetching && <div className={styles.loadingSpinner}><LoadingSpinner/></div>}
                    {!isFetching && data && data.posts.length > 0 && data.posts.map((post, index)=>{
                        if(data.posts.length === index+1) return (<PostCard key={post.id}   
                                                                        id ={post.id}
                                                                        num={(currentPage-1)*POSTSPERPAGE+(index+1)} 
                                                                        currentPage={currentPage}
                                                                        post={post} 
                                                                        handleSelection={handleSelection}
                                                                        keyword={keyword}
                                                                        last={true} />)   
                        else return (<PostCard  key={post.id}
                                            id={post.id} 
                                            num={(currentPage-1)*5+(index+1)} 
                                            currentPage={currentPage}
                                            handleSelection={handleSelection}
                                            post={post}
                                            keyword={keyword}
                                            />)       
                    })}
                </div>
            </div>
            {data && data.posts.length === 0 && <div className={styles.noContent}> <span>No Posts</span> </div>}
            {data && data.posts.length > 0 && totalPage && 
            <footer>
                <nav className={styles.nav}>
                    {hasPrev && 
                    <button className={styles.btn} onClick={customHandlePrevious}> 
                        {"<<"}
                    </button>}
                    {Array(endPage-startPage+1)
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

export default React.memo(Posts);
