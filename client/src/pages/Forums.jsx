import React from 'react';
import styles from './Forums.module.css'
import PostCreateEntry from '../components/Forum/PostCreateEntry';
import { useLocation} from 'react-router-dom';
import Posts from '../components/Forum/Posts';
import SearchBar from '../components/Forum/SearchBar';

export default function Forums({postService}) {
    const {state: post} = useLocation();
    
    return (
        <div className={styles.forum}>
            {!post && <PostCreateEntry/>}
            <Posts postService={postService} 
                    keyword={post && post.keyword && post.keyword}/>
            <SearchBar postService={postService}/>
        </div>
    );
}

