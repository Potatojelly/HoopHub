import React, { useEffect, useState } from 'react';
import styles from './ViewPost.module.css'
import Post from '../components/Forum/Post';
import Posts from '../components/Forum/Posts';
import SearchBar from '../components/Forum/SearchBar';
import {useLocation} from "react-router-dom";
import { useUpdatePostView } from '../hooks/usePostsData';

export default function ViewPost() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const postNum = parseInt(searchParams.get("postNum"));
    const [isViewUpdated,setIsViewUpdated] = useState(false);
    const {mutate: updatePostView} = useUpdatePostView();
    useEffect(()=>{
        if(postNum) {
            if(isViewUpdated) setIsViewUpdated(false);
            updatePostView(postNum,{
                onSuccess: () => {
                    setIsViewUpdated(true);
                }
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[postNum])
    return (
        <div className={styles.viewPost}>
            {isViewUpdated &&
            <>
                <Post/>
                <Posts/>
                <SearchBar/>
            </>}
        </div>
    );
}

