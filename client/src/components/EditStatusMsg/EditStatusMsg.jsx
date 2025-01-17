import React, { useState } from 'react';
import styles from './EditStatusMsg.module.css'
import { useEditStatusMessage} from '../../hooks/useMyProfileData';

export default function EditStatusMsg({currentMsg,setMsg,setErrors,onClose,setSuccess}) {
    const [charCount,setCharCount] = useState(currentMsg.length);
    const {mutate: updateStatusMsg} = useEditStatusMessage();

    const onSubmit = (e) => {
        e.preventDefault();
        updateStatusMsg(currentMsg,
            {
                onSuccess: (data)=>{
                    setSuccess(data.message);
                    setTimeout(()=>{setSuccess("")},3000);
                    onClose(e);
                },
                onError: (error)=>{
                    setErrors(error)
                    setTimeout(()=>setErrors(""),3000);
                    onClose(e);
                }
            }
        )
    }

    const onChange = (e) => {
        const text = e.target.value;
        if(text.length <= 60) {
            setMsg(text);
            setCharCount(text.length);
        }
    }

    const onCancel = (e) => {
        onClose(e);
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
                        <button type="submit" className={styles.formBtnCancel} onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.formBtnUpdate}>
                            Update
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

