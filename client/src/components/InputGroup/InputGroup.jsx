import React, { useState } from 'react';
import styles from './InputGroup.module.css'
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";


export default function InputGroup({placeholder,value,setValue,error,type,onChange}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className={styles.container}>
            <input
                className={`${styles.inputContainer} ${error && styles.inputError}`} 
                type={isPasswordVisible ? 'text' : type} 
                placeholder={placeholder}
                value={value}
                onChange={onChange ? onChange : handleChange}
                required
                autoComplete="off"
                
            />
            {type === "password" && 
            <button type="button" className={styles.viewBtn} onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <IoMdEyeOff/> : <IoMdEye/>}
            </button>}
            <small className={styles.errorMsg}>{error}</small>
        </div>
    );
}

