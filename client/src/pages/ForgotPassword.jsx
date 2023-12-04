import React, { useState } from 'react';
import styles from './ForgotPassword.module.css'
import Logo from '../components/Logo/Logo';
import {Link} from "react-router-dom";
import InputGroup from '../components/InputGroup/InputGroup';

export default function ForgotPassword({retrieveService}) {
    const [username,setUsername] = useState("");
    const [success,setSuccess] = useState("");
    const [errors, setErrors] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        retrieveService.retrievePassword(username)
            .then((data) => {
                setErrors("");
                setSuccess(data.message);
                setTimeout(()=>{setSuccess("")},4000);
            })
            .catch((error) => {
                setErrors(error);
            })
    };

    return (
        <div className={styles.container}>
            <Logo/>
            <div className={styles.subContainer}>
                <h1 className={styles.title}>Forgot password?</h1>
                <div className={styles.description}>
                    <small>Enter your username to receive an email with temporary password</small>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        placeholder="Username"
                        type={"text"}
                        value={username}
                        setValue={setUsername}
                        error={errors.username}
                    />
                    <button className={styles.submitBtn}>
                        Submit
                    </button>
                </form>
                <small>
                    <Link to="/login" className={styles.linkBtn}>Return to Login</Link>
                </small>
            </div>
            <div>
                {success && <p className={styles.successMsg}> ✅ {success} </p>}
            </div>
        </div>
    );
}

