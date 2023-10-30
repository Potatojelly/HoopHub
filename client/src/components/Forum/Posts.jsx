import React, { useEffect, useState } from 'react';
import styles from './Posts.module.css'
import PostCard from './PostCard';
import {v4 as uuidv4} from "uuid";
import { usePostQuery, usePost  } from '../../hooks/usePost';
import SearchBar from './SearchBar';
import { usePostContext } from '../../context/PostContext';
import useMyPost from '../../hooks/useMyPost';
import {useQuery} from '@tanstack/react-query';
const POSTSPERPAGE = 5;

function Posts({postService,keyword}) {
    const {selectedPostID,selectedPage,setSelectedPage,setPostID} = usePostContext();
    const [currentPage, setCurrentPage] = useState(selectedPage ? selectedPage : 1);

    useEffect(()=>{
        console.log("mount!");
    },[])

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
    } = usePost();

    const {
        data,
        isFetching,
    } = usePostQuery(currentPage,keyword ? keyword : null);


    useEffect(()=>{
        if(data) {
            if(selectedPostID) setPageInfo(data.total_posts,selectedPage);
            else setPageInfo(data.total_posts,currentPage);
        } 
    },[data])

    const handleSelection = (postID) => {
        setPostID(postID);
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
            {data && data.posts.length > 0 &&
            <div className={styles.postsContainer}>
                <div className={styles.postsSubContainer}>
                    {data.posts.map((post, index)=>{
                        if(data.posts.length === index+1) return (<PostCard key={post.id}   
                                                                        id ={post.id}
                                                                        num={(currentPage-1)*POSTSPERPAGE+(index+1)} 
                                                                        post={post} 
                                                                        handleSelection={handleSelection}
                                                                        keyword={keyword}
                                                                        last={true} />)   
                        else return (<PostCard  key={post.id}
                                            id={post.id} 
                                            num={(currentPage-1)*5+(index+1)} 
                                            handleSelection={handleSelection}
                                            post={post}
                                            keyword={keyword}
                                            />)       
                    })}
                </div>
            </div>
            }
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

export default React.memo(Posts);
