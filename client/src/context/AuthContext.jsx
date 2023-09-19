import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {useNavigate} from "react-router-dom";
const AuthContext = createContext({});

export function AuthProvider({authService, authErrorEventBus, children}) {
    const [user,setUser] = useState(undefined);
    const [nickname,setNickname] = useState(undefined);
    const [imageURL,setImageURL] = useState(undefined);
    const [statusMsg,setStatusMsg] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        authService.me()
            .then((user)=>{
                setUser({token:user.token, username: user.username});
                setImageURL(user.imageURL);
                setStatusMsg(user.statusMsg);
                setNickname(user.nickname);
                setLoading(!loading);
            })
            .catch((err)=>console.log(err));
    },[authService]);
 
    useEffect(()=>{
        authErrorEventBus.listen((error)=>{
            window.confirm(error);
            console.log(error);
            setUser(undefined);
            navigate("/");
        })
    },[authErrorEventBus,navigate]);

    const signup = useCallback(
        async (email, nickname, username, password) =>
            authService
                .signup(email, nickname, username, password)
    , [authService]);

    const login = useCallback(
        async (username,password) => 
            authService
                .login(username,password)
                .then((user)=>{
                    setUser({token:user.token, username: user.username});
                    setImageURL(user.imageURL);
                    setStatusMsg(user.statusMsg);
                    setNickname(user.nickname);
                    setLoading(!loading);
                })
    ,[authService]);

    const logout = useCallback(
        async () => 
            authService
                .logout()
                .then(()=>{
                    setUser(undefined);
                    setLoading(!loading);
                })
    ,[authService]);

    const resetPassword = useCallback(
        async (username,password,newPassword) => 
            authService
                .resetPassword(username,password,newPassword)
                .then((user)=>user)
    ,[authService]);

    const updateStatusMsg = useCallback(
        async (username, statusMsg) => 
            authService
                .updateStatusMsg(username, statusMsg)
                .then((user)=>{
                    setStatusMsg(user.statusMsg);
                    return user.message;
                })
    ,[authService]);

    const updateImg = useCallback(
        async (username, formData) => 
            authService
                .updateImg(username, formData)
                .then((user)=>{
                    setImageURL(user.imageURL);
                    return user.message;
                })
    ,[authService]);

    const context = useMemo(
        ()=>({
            user,
            nickname,
            imageURL,
            statusMsg,
            loading,
            signup,
            login,
            logout,
            resetPassword,
            updateStatusMsg,
            updateImg,
        }),[user,nickname,imageURL,statusMsg,loading,signup,login,logout,resetPassword,updateStatusMsg,updateImg])

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export class AuthErrorEventBus {
    listen(callback) {
        this.callback = callback;
    }

    notify(error) {
        this.callback(error);
    }
}

export function useAuth() {
    return useContext(AuthContext);
}