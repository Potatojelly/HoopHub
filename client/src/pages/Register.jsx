import React, {useState} from 'react';
import styles from './Register.module.css'
import InputGroup from '../components/InputGroup/InputGroup';
import {Link} from "react-router-dom";
import {IoIosBasketball} from "react-icons/io";
import Logo from '../components/Logo/Logo';

export default function Register() {
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [errors,setErrors] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className={styles.registerContainer}>
            <Logo/>
            <div className={styles.registerSubContainer}>
                <h1 className={styles.title}>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        placeholder="Email"
                        value={email}
                        setValue={setEmail}
                        error={errors.email}
                    />
                    <InputGroup
                        placeholder="Username"
                        value={username}
                        setValue={setUsername}
                        error={errors.username}
                    />
                    <InputGroup
                        placeholder="Password"
                        value={password}
                        setValue={setPassword}
                        error={errors.password}
                    />
                    <button className={styles.signUpBtn}>
                        Sign Up
                    </button>
                </form>
                <small>
                    Already have an account? 
                    <Link to="/login">
                        <a className={styles.login}>Login</a>
                    </Link>
                </small>
            </div>
        </div>
    );
}

