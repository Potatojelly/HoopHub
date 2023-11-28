import React from 'react';
import styles from './InputGroup.module.css'

export default function InputGroup({placeholder,value,setValue,error,type,onChange}) {
    const handleChange = (e) => {
        setValue(e.target.value);
    }
    return (
        <div className={styles.container}>
            <input
                className={`${styles.inputContainer} ${error && styles.inputError}`} 
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange ? onChange : handleChange}
                required
                autoComplete="off"
            />
            <small className={styles.errorMsg}>{error}</small>
        </div>
    );
}

