import React, {useState} from 'react';
import styles from './ResetPassword.module.css'
import InputGroup from '../components/InputGroup/InputGroup';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
    const [success,setSuccess] = useState("Reset Password Success!");
    const [currentPassword,setCurrentPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [errors,setErrors] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        // login(username,password)
        //     .then(()=>{navigate("/")})
        //     .catch((error) => {
        //         const resultObject = {};
        //         error.forEach(item=>{
        //             const key = Object.keys(item)[0];
        //             resultObject[key] = item[key];
        //         });
        //         setErrors(resultObject);
        //     })
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if(e.target.value === "") {
            setErrors("");
        }
        else if(e.target.value !== newPassword) {
            setErrors({confirmPassword: "Password does not match"});
        }
        else { 
            setErrors("");
        }
    }
    return (
        <div className={styles.resetContainer}>
            <div className={styles.resetSubContainer}>
                <h1 className={styles.title}>Password Reset</h1>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        placeholder="Current Password"
                        type={"password"}
                        value={currentPassword}
                        setValue={setCurrentPassword}
                        error={errors.currentPassword}
                    />
                    <InputGroup
                        placeholder="New Password"
                        type={"password"}
                        value={newPassword}
                        setValue={setNewPassword}
                        error={errors.newPassword}
                    />
                    <InputGroup
                        placeholder="Confirm Password"
                        type={"password"}
                        value={confirmPassword}
                        error={errors.confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    <button className={styles.resetBtn}>
                        Reset
                    </button>
                </form>
                {success && <p className={styles.successMsg}> ✅ {success} </p>}
            </div>
        </div>
    );
}

