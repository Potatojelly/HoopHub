import { createContext, createRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {useNavigate} from "react-router-dom";

const AuthContext = createContext({});

const tokenRef  = createRef();

export function AuthProvider({authService, authErrorEventBus, children}) {
    const [user,setUser] = useState(undefined);
    // const [myFriendRequest,setMyFriendRequest] = useState(undefined);
    // const [receivedFriendRequest,setReceivedFriendRequest] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        tokenRef.current = user ? user.token : undefined;
    },[user])

    useEffect(() => {
        if(authErrorEventBus) {
            authService.me()
            .then((user)=>{
                setUser({token:user.token, username: user.username});
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setLoading(!loading);
            })
            .catch((err)=>console.log(err));
        }
    },[]);
 
    useEffect(()=>{
        if(authErrorEventBus) {
            authErrorEventBus.listen((error)=>{
                console.log(error);
                setUser(undefined);
                if(window.confirm(error)) {
                    navigate("/"); 
                } else {
                    navigate("/"); 
                }
            })
        }
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
                    console.log(user);
                    setUser({token:user.token, username: user.username});
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

    // const getReceivedFriendRequest = useCallback(
    //     async () => 
    //         authService
    //             .getReceivedFriendRequest()
    //             .then((user)=>{
    //                 setReceivedFriendRequest(user.receivedRequest);
    //             })
    // ,[authService]);

    // const getMyFriendRequest = useCallback(
    //     async () => 
    //         authService
    //             .getMyFriendRequest()
    //             .then((user)=>{
    //                 setMyFriendRequest(user.myRequest);
    //             })
    // ,[authService]);

    // const sendFriendRequest = useCallback(
    //     async (nickname) =>
    //         authService
    //             .sendFriendRequest(nickname)
    //             .then((data)=>data)
    // )

    // const cancelMyFriendRequest = useCallback(
    //     async (nickname) =>
    //         authService
    //             .cancelMyFriendRequest(nickname)
    //             .then((data)=>data)
    // )

    // const acceptReceivedFriendRequest = useCallback(
    //     async (nickname) =>
    //         authService
    //             .acceptFriendRequest(nickname)
    //             .then((data)=>data)
    // )

    // const rejectReceivedFriendRequest = useCallback(
    //     async (nickname) =>
    //         authService
    //             .rejectFriendRequest(nickname)
    //             .then((data)=>data)
    // )

    const context = useMemo(
        ()=>({
            user,
            loading,
            signup,
            login,
            logout,
            resetPassword,
            setUser
        }),[user,loading,signup,login,logout,resetPassword])

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
        // throw new Error("Please call init AuthErrorEventBus first");
    }
    return authErrorEventBus;
}



export const fetchToken = () => tokenRef.current;

export function useAuth() {
    return useContext(AuthContext);
}