import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {useNavigate} from "react-router-dom";
const AuthContext = createContext({});

export function AuthProvider({authService, authErrorEventBus, children}) {
    const [user,setUser] = useState(undefined);
    const [imageURL,setImageURL] = useState(undefined);
    const [statusMsg,setStatusMsg] = useState(undefined);
    const navigate = useNavigate();
    if(user) console.log(user);
    useEffect(() => {
        authService.me()
            .then((user)=>{
                setUser({token:user.token, username: user.username})
                setImageURL(user.imageURL);
                setStatusMsg(user.statusMsg);
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
                    setUser({token:user.token, username: user.username})
                    setImageURL(user.imageURL);
                    setStatusMsg(user.statusMsg);
                })
    ,[authService]);

    const logout = useCallback(
        async () => 
            authService
                .logout()
                .then(()=>setUser(undefined))
    ,[authService]);

    const context = useMemo(
        ()=>({
            user,
            signup,
            login,
            logout
        }),[user,signup,login,logout])

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