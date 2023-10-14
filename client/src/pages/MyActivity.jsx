import React, { useState } from 'react';
import styles from './MyActivity.module.css'
import MyPosts from '../components/MyActivity/MyPosts';
import MyComments from "../components/MyActivity/MyComments";
export default function MyActivity({postService}) {
    const [activeBtn,setActiveBtn] = useState(window.history.state.type ? window.history.state.type : 1);
    const handleButtonClick = (buttonNumber) => {
        setActiveBtn(buttonNumber);
    };

    return (
        <div className={styles.container}>
            <div className={styles.activityContainer}>
                <button className={`${styles.myPosts} ${activeBtn === 1 && styles.active}` }
                        onClick={()=>handleButtonClick(1)}>
                    My Posts
                </button>
                <button className={`${styles.myComments} ${activeBtn === 2 && styles.active}`}
                        onClick={()=>handleButtonClick(2)}>
                    My Comments
                </button>
            </div>
            {activeBtn===1 && <MyPosts postService={postService}/>}
            {activeBtn===2 && <MyComments postService={postService}/>}
        </div>
    );
}

