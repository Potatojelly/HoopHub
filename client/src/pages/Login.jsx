import React, {useState} from 'react';
import styles from './Login.module.css'
import InputGroup from '../components/InputGroup/InputGroup';
import Logo from '../components/Logo/Logo';
import {Link} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [errors,setErrors] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username,password)
            .then(()=>{navigate("/")})
            .catch((error) => {
                setErrors(error);
            })
    }
    return (
        <div className={styles.loginContainer}>
            <Logo/>
            <div className={styles.loginSubContainer}>
                <h1 className={styles.title}>Login</h1>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        placeholder="Username"
                        type={"text"}
                        value={username}
                        setValue={setUsername}
                        error={errors.username}
                    />
                    <InputGroup
                        placeholder="Password"
                        type={"password"}
                        value={password}
                        setValue={setPassword}
                        error={errors.password}
                    />
                    <button className={styles.loginBtn}>
                        Login
                    </button>
                </form>
                <div className={styles.smallContainer}>
                    <small>
                        New to Hoop Hub? 
                        <Link to="/register" className={styles.linkBtn}>Sign Up</Link>
                    </small>
                    <div className={styles.forgotContainer}>
                        <small>
                            <Link to="/forgot-username" className={styles.linkBtn}>Forgot username?</Link>
                        </small>
                        <small>
                            <Link to="/forgot-password" className={styles.linkBtn}>Forgot password?</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

