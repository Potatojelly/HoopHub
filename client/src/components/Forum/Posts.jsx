import React, { useEffect, useState } from 'react';
import styles from './Posts.module.css'
import PostCard from './PostCard';
import {v4 as uuidv4} from "uuid";
import usePost from '../../hooks/usePost';
import SearchBar from './SearchBar';

const POSTSPERPAGE = 5;

// export default function Posts({postService}) {
function Posts({postService,page,selectedPost,keyword}) {
    const [isSelected,setIsSelected] = useState(null);
    useEffect(()=>{
        setIsSelected(selectedPost);
    },[])

    const {
        posts,
        currentPage,
        totalPage,
        startPage,
        endPage,
        hasPrev,
        hasNext,
        handlePrevious,
        handleNext,
        handlePage,
    } = usePost(postService,page,keyword ? keyword : null);

    const handleSelection = (postID) => {
        setIsSelected(postID)
    }

    const customHandlePrevious = () => {
        handlePrevious();
        setIsSelected(null);
    }

    const customHandleNext = () => {
        handleNext();
        setIsSelected(null);
    }

    const customHandlePage = (startPage,index) => {
        handlePage(startPage,index);
        setIsSelected(null);
    }
    return (
        <div className={styles.posts}>
            <h1 className={styles.title}>Posts</h1>
            {posts && posts.length > 0 &&
            <div className={styles.postsContainer}>
                <div className={styles.postsSubContainer}>
                    {posts.map((post, index)=>{
                        if(posts.length === index+1) return (<div  key={uuidv4()}  onClick={()=>{handleSelection(post.id)}}>
                                                                <PostCard   id ={post.id}
                                                                        num={(currentPage-1)*POSTSPERPAGE+(index+1)} 
                                                                        post={post} 
                                                                        isSelected={isSelected}
                                                                        currentPage={currentPage}
                                                                        keyword={keyword}
                                                                        last={true} />
                                                            </div>)   
                        else return (<div  key={uuidv4()}  onClick={()=>{handleSelection(post.id)}}>
                                    <PostCard id={post.id} 
                                            num={(currentPage-1)*5+(index+1)} 
                                            post={post}
                                            currentPage={currentPage}
                                            keyword={keyword}
                                            isSelected={isSelected}/>
                                    </div>)       
                    })}
                </div>
            </div>
            }
            {posts.length === 0 && <div className={styles.noContent}> <span>No Posts</span> </div>}
            {posts && posts.length > 0 && totalPage && 
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
            <SearchBar postService={postService}/>
        </div>
    );
}

export default React.memo(Posts);
