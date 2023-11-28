import { createContext, createRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {useNavigate} from "react-router-dom";

const AuthContext = createContext({});

const tokenRef  = createRef();

export function AuthProvider({authService, authErrorEventBus, children}) {
    const [user,setUser] = useState(undefined);
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        tokenRef.current = user ? user.token : undefined;
    },[user])

    useEffect(() => {
        if(authErrorEventBus) {
            authService.me()
                .then((user)=>{
                    if(user?.token) {
                        setUser({token:user.token, username: user.username});
                        setIsLoading(false);
                    }
                })
                .catch((err)=>{
                    setIsLoading(false);
                    console.log(err)
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[authErrorEventBus]);

    useEffect(()=>{
        if(!user && authErrorEventBus) {
            authErrorEventBus.listen(()=>{});  
        } 
        if(user && authErrorEventBus) {
            authErrorEventBus.listen((error)=>{
                setUser(undefined);
                window.confirm(error);
                navigate("/"); 
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[authErrorEventBus]);

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
                    setIsLoading(false);
                })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[authService]);

    const logout = useCallback(
        async () => 
            authService
                .logout()
                .then(()=>{
                    setUser(undefined);
                    setIsLoading(true);
                    navigate("/"); 
                })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[authService]);

    const resetPassword = useCallback(
        async (username,password,newPassword) => 
            authService
                .resetPassword(username,password,newPassword)
                .then((user)=>user)
    ,[authService]);

    const context = useMemo(
        ()=>({
            user,
            isLoading,
            signup,
            login,
            logout,
            resetPassword,
            setUser
        }),[user,isLoading,signup,login,logout,resetPassword])

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

let authErrorEventBus;

export class AuthErrorEventBus {
    listen(callback) {
        this.callback = callback;
    }

    notify(error) {
        this.callback(error);
    }
}

export function initAuthErrorEventBus() {
    if(!authErrorEventBus) {
        authErrorEventBus = new AuthErrorEventBus();
    }
}

export function getAuthErrorEventBus() {
    if(!authErrorEventBus) {
        authErrorEventBus = new AuthErrorEventBus();
    }
    return authErrorEventBus;
}

export const fetchToken = () => tokenRef.current;

export function useAuth() {
    return useContext(AuthContext);
}