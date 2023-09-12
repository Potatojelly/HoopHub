import React, {useState} from 'react';
import styles from './Login.module.css'
import InputGroup from '../components/InputGroup/InputGroup';
import {Link} from "react-router-dom";
import Logo from '../components/Logo/Logo';

export default function Login() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [errors,setErrors] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <div className={styles.loginContainer}>
            <Logo/>
            <div className={styles.loginSubContainer}>
                <h1 className={styles.title}>Login</h1>
                <form onSubmit={handleSubmit}>
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
                    <button className={styles.loginBtn}>
                        Login
                    </button>
                </form>
                <small>
                    New to Hoop Hub? 
                    <Link to="/register">
                        <a className={styles.signUp}>Sign Up</a>
                    </Link>
                </small>
            </div>
        </div>
    );
}

