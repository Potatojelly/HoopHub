import React, { useEffect, useMemo, useRef, useState, memo } from 'react';
import styles from './CreateReply.module.css'
import './quill.css';
import ReactQuill from 'react-quill';
import {useQueryClient} from "@tanstack/react-query";
import { useCreateReply } from '../../hooks/useCommentsData';
import Alarm from '../Alarm/Alarm';

const CreateReply = ({author, commentID, selectedPostID, handleReplyClick, custom})=> {
    const queryClient = useQueryClient();
    const quillRef = useRef();
    const [isError,setIsError] = useState(false);
    const [reply,setReply] = useState(()=>author ? author : "");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const {mutate:createReply} = useCreateReply();

    // react-quill: DOMnodeInserted Deprecation.
    useEffect(()=>{
        const editor = quillRef.current.getEditor(); 

        if(author) {
            editor.insertText(0, author, {"bold": true, "color": "#007bff"});
            editor.setSelection(author.length+1, author.length+1);
            editor.insertText(author.length, " ", {"bold": false,"color": "black"});
        }

        editor.keyboard.bindings[13].unshift({
            key: 13,
            handler: () => {
                document.getElementById('submitButton').click();
                return false;
            }
        });
    },[author]);

    const modules = useMemo(()=> {
        return {
            toolbar: false,
        }
    },[]);

    const handleReply = (newContent) => {
        setReply(newContent);
        setIsSubmitDisabled(newContent === "<p><br></p>");
    }

    const submitReply = (e) => {
        e.preventDefault();
        createReply({selectedPostID,commentID,replyText:reply},{
            onSuccess: () => {
                queryClient.invalidateQueries(['post', selectedPostID]);    
                queryClient.invalidateQueries(['posts']);
                queryClient.invalidateQueries(["comments"]);
                handleReplyClick();
                setIsSubmitDisabled(true);
            },
            onError: () => {
                setIsError(true);
                setTimeout(()=>{setIsError(false)},3000);
            }
        })
    }

    return (
        <form className={custom ? `${styles.custom}` : `${styles.reply}`} onSubmit={submitReply}>
            <ReactQuill className={"reply"}
                        ref={quillRef}
                        placeholder={'Please leave a comment.'}
                        onChange={handleReply}
                        modules={modules}/>
            <button className={styles.replyBtn} disabled={isSubmitDisabled} id="submitButton" >Reply</button>
            {isError && <Alarm message={"Something went wrong..."}/>}
        </form>
    );
}

export default memo(CreateReply);

