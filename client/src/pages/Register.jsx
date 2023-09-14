import React, {useState} from 'react';
import styles from './Register.module.css'
import InputGroup from '../components/InputGroup/InputGroup';
import Logo from '../components/Logo/Logo';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [success,setSuccess] = useState("Sign Up Success!\nPlease Login!");
    const [email,setEmail] = useState("");
    const [nickname,setNickname] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [errors,setErrors] = useState("");
    const {signup} = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(email,nickname,username,password)
            .then((data)=>{
                if(data) {
                    setSuccess("Sign Up Success!\n Please login!");
                    setTimeout(()=>{setSuccess(null)},4000);
                }
            })
            .catch((error) => {
                const resultObject = {};
                error.forEach(item=>{
                    const key = Object.keys(item)[0];
                    resultObject[key] = item[key];
                });
                setErrors(resultObject);
            })
    }

    return (
        <div className={styles.registerContainer}>
            <Logo/>
            <div className={styles.registerSubContainer}>
                <h1 className={styles.title}>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        placeholder="Email"
                        type={"text"}
                        value={email}
                        setValue={setEmail}
                        error={errors.email}
                        required
                    />
                    <InputGroup
                        placeholder="Nickname"
                        type={"text"}
                        value={nickname}
                        setValue={setNickname}
                        error={errors.nickname}
                        required
                    />
                    <InputGroup
                        placeholder="Username"
                        type={"text"}
                        value={username}
                        setValue={setUsername}
                        error={errors.username}
                        required
                    />
                    <InputGroup
                        placeholder="Password"
                        type={"password"}
                        value={password}
                        setValue={setPassword}
                        error={errors.password}
                        required
                    />
                    <button className={styles.signUpBtn}>
                        Sign Up
                    </button>
                </form>
                <small>
                    Already have an account? 
                    <a href="/login" className={styles.login}>Login</a>
                </small>
                {success && <p className={styles.successMsg}> ✅ {success} </p>}
            </div>
        </div>
    );
}

