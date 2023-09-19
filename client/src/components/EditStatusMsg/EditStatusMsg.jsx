import React, { useState } from 'react';
import styles from './EditStatusMsg.module.css'
import { useAuth } from '../../context/AuthContext';

export default function EditStatusMsg({currentMsg,setMsg,setErrors,onClose,setSuccess}) {
    const [originalMsg,setOriginalMsg] = useState(currentMsg);
    const [charCount,setCharCount] = useState(currentMsg.length);
    const {user, updateStatusMsg} = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        updateStatusMsg(user.username,currentMsg)
            .then((message)=>{
                setSuccess(message);
                setTimeout(()=>{setSuccess("")},4000);
            })
            .catch((error)=>{
                setErrors(error)
                setTimeout(()=>setErrors(""),4000);
            });
        onClose();
    }

    const onChange = (e) => {
        const text = e.target.value;
        if(text.length <= 60) {
            setMsg(text);
            setCharCount(text.length);
        }
    }

    const onCancel = () => {
        onClose();
        setMsg(originalMsg);
    }

    return (
        <>
            <form onSubmit={onSubmit} className={styles.editStatusMsgContainer}>
                <textarea 
                    type="text" 
                    placeholder='Enter a status Msg'
                    value = {currentMsg}
                    autoFocus
                    onChange={onChange}
                    className={styles.editInputForm}
                />
                <div className={styles.editFormAction}>
                    <small className={styles.charCount}>{charCount} / 60</small>
                    <div className={styles.formBtnContainer}>
                        <button type="submit" className={styles.formBtnUpdate}>
                            Update
                        </button>
                        <button type="submit" className={styles.formBtnCancel} onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

