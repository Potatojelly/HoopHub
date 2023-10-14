import React, { useEffect, useState } from 'react';
import styles from './MyPosts.module.css'
import MyPostCard from './MyPostCard';
import useMyPost from '../../hooks/useMyPost';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelectedCard } from '../../context/SelectedCardContext';
import { useSearchParams } from 'react-router-dom';

const POSTSPERPAGE = 10;
export default function MyPosts({postService}) {
    const [selectedCard,setSelectedCard] = useState(window.history.state.my_posts ? window.history.state.my_posts : null);

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
    } = useMyPost(postService, selectedCard ? Math.ceil(selectedCard/POSTSPERPAGE) : null);

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <span className={styles.infoNum}>No.</span>
                <span className={styles.infoTitle}>Title</span>
                <span className={styles.infoCreatedDate}>Created Date</span>
                <span className={styles.infoView}>Views</span>
            </div>
            {!posts && <div className={styles.noContent}> <span>No Posts</span> </div>}
            {posts && posts.map((post,index)=><MyPostCard key={index} 
                                                        post={post} 
                                                        num={(currentPage-1)*POSTSPERPAGE+(index+1)}
                                                        selectedCard={selectedCard}
                                                        setSelectedCard={setSelectedCard}/>)}
            {posts && 
            <footer>          
                <nav className={styles.nav}>
                    {hasPrev && 
                    <button className={styles.btn} onClick={()=>{handlePrevious(); setSelectedCard(null)}}> 
                        {"<<"}
                    </button>}
                    {posts.length > 0 && 
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

