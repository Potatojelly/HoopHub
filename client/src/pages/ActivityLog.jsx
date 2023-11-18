import React, { useState } from 'react';
import styles from './ActivityLog.module.css';
import ActivityPosts from '../components/Activity/ActivityPosts';
import ActivityComments from '../components/Activity/ActivityComments';
export default function ActivityLog({userNickname}) {
    const [activeBtn,setActiveBtn] = useState(window.history.state.type ? window.history.state.type : 1);
    const handleButtonClick = (buttonNumber) => {
        setActiveBtn(buttonNumber);
    };

    return (
        <div className={styles.mainScreen}>
            <div className={styles.container}>
                <div className={styles.activityContainer}>
                    <button className={`${styles.myPosts} ${activeBtn === 1 && styles.active}` }
                            onClick={()=>handleButtonClick(1)}>
                        Posts
                    </button>
                    <button className={`${styles.myComments} ${activeBtn === 2 && styles.active}`}
                            onClick={()=>handleButtonClick(2)}>
                        Comments
                    </button>
                </div>
                {activeBtn===1 && <ActivityPosts userNickname={userNickname && userNickname}/>}
                {activeBtn===2 && <ActivityComments userNickname={userNickname && userNickname}/>}
            </div>
        </div>
    );
}

