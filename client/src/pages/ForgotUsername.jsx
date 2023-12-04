import React, { useState } from 'react';
import styles from './ForgotUsername.module.css'
import Logo from '../components/Logo/Logo';
import {Link} from "react-router-dom";
import InputGroup from '../components/InputGroup/InputGroup';

export default function ForgotUsername({retrieveService}) {
    const [email,setEmail] = useState("");
    const [success,setSuccess] = useState("");
    const [errors,setErrors] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        retrieveService.retrieveUsername(email)
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
                <h1 className={styles.title}>Forgot username?</h1>
                <div className={styles.description}>
                    <small>Enter your email to retireve your username</small>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        placeholder="Email"
                        type={"text"}
                        value={email}
                        setValue={setEmail}
                        error={errors.email}
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

