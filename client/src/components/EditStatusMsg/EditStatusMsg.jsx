import React from 'react';
import styles from './EditStatusMsg.module.css'

export default function EditStatusMsg({currentMsg,setMsg,onClose}) {

    const onSubmit = async (e) => {
        e.preventDefault();
        onClose();
    }

    const onChange = (e) => {
        setMsg(e.target.value);
    }
    return (
        <form onSubmit={onSubmit} className={styles.editStatusMsgContainer}>
            <input 
                type="text" 
                placeholder='Enter a status Msg'
                value = {currentMsg}
                autoFocus
                onChange={onChange}
                className={styles.editInputForm}
            />
            <div className={styles.editFormAction}>
                <button type="submit" className={styles.formBtnUpdate}>
                    Update
                </button>
                <button type="submit" className={styles.formBtnCancel} onClick={onClose}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

