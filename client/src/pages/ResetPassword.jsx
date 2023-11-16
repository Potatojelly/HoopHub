import React, {useState} from 'react';
import styles from './ResetPassword.module.css'
import InputGroup from '../components/InputGroup/InputGroup';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
    const {user,resetPassword} = useAuth(); 
    const [success,setSuccess] = useState("");
    const [password,setPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [samePassword,setSamePassword] = useState(false);
    const [matchPassword,setMatchPassword] = useState(false);
    const [errors,setErrors] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        resetPassword(user.username, password, newPassword)
            .then((data)=>{
                setSuccess(data.message);
                setTimeout(()=>{setSuccess("")},4000);
            })
            .catch((error) => {
                setErrors(error);
            })
    }
    
    const handleNewPassWordChange = (e) => {
        setNewPassword(e.target.value);
        if(e.target.value === password) 
        {
            setErrors({newPassword: "New password is the same with the current password"});
            setSamePassword(true);
        }
        else if(e.target.value !== password) {
            setErrors({...errors,newPassword:""});
            setSamePassword(false);
        }

        if(confirmPassword !== "" && e.target.value !== confirmPassword) {
            setErrors({confirmPassword: "Password does not match"});
        } 
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if(e.target.value === "") {
            setErrors({...errors,confirmPassword:""});
            setMatchPassword(false);
        }
        else if(e.target.value !== newPassword) {
            setErrors({...errors, confirmPassword: "Password does not match"});
            setMatchPassword(false);
        }
        else if(e.target.value === newPassword) { 
            setErrors({...errors,confirmPassword:""});
            setMatchPassword(true);
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
                        value={password}
                        setValue={setPassword}
                        error={errors.password}
                    />
                    <InputGroup
                        placeholder="New Password"
                        type={"password"}
                        value={newPassword}
                        setValue={setNewPassword}
                        error={errors.newPassword}
                        onChange={handleNewPassWordChange}
                    />
                    <InputGroup
                        placeholder="Confirm Password"
                        type={"password"}
                        value={confirmPassword}
                        error={errors.confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    <button className={`${styles.resetBtn} ${!samePassword && matchPassword && styles.resetBtnActive}`} disabled={samePassword && !matchPassword && true}>
                        Reset
                    </button>
                </form>
                {success && <p className={styles.successMsg}> ✅ {success} </p>}
            </div>
        </div>
    );
}

