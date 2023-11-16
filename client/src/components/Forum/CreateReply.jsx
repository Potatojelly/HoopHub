import React, { useEffect, useMemo, useRef, useState, memo } from 'react';
import styles from './CreateReply.module.css'
import ReactQuill from 'react-quill';
import {useQueryClient} from "@tanstack/react-query";

import './quill.css';
import { usePostContext } from '../../context/PostContext';

const CreateReply = ({author,setPost,commentID, commentPage, postService, handleReplyClick, custom})=> {
    const {selectedPage,selectedPostID} = usePostContext();
    const queryClient = useQueryClient();
    const [reply,setReply] = useState(()=>author ? author : "");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const quillRef = useRef();

    useEffect(()=>{
        console.log("chekcing");
        const editor = quillRef.current.getEditor(); 

        if(author) {
            editor.insertText(0, author, {"bold": true, "color": "#007bff"});
            editor.setSelection(author.length+1, author.length+1);
            editor.insertText(author.length, " ", {"bold": false,"color": "black"});
        }
        editor.keyboard.bindings[13].unshift({
            key: 13,
            handler: (range, context) => {
                document.getElementById('submitButton').click();
                return false;
            }
        });
    },[]);


    const handleReply = (newContent) => {
        setReply(newContent);
        setIsSubmitDisabled(newContent === "<p><br></p>");
    }

    const submitReply = (e) => {
        e.preventDefault();
        postService.createReply(selectedPostID,commentID,reply)
            .then((data)=>{
                if(data.success === true) {
                    postService.getPost(selectedPostID)
                        .then((result)=>{setPost(result.post)})
                        .catch((err)=>console.log(err))
                    queryClient.invalidateQueries(['posts', selectedPage]);
                    queryClient.invalidateQueries(["comments",selectedPostID,commentPage]);
                    handleReplyClick();
                    setIsSubmitDisabled(true);
                }
            })
    }

    const modules = useMemo(()=> {
        return {
            toolbar: false,
        }
    },[]);

    return (
        <form className={custom ? `${styles.custom}` : `${styles.reply}`} onSubmit={submitReply}>
            <ReactQuill className={"reply"}
                        ref={quillRef}
                        placeholder={'Please leave a comment.'}
                        onChange={handleReply}
                        modules={modules}/>
            <button className={styles.replyBtn} disabled={isSubmitDisabled} id="submitButton" >Reply</button>
        </form>
    );
}

export default memo(CreateReply);

