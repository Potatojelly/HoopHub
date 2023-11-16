import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {useQueryClient, useQuery, useMutation} from "@tanstack/react-query";
import { useAuth } from './AuthContext.jsx';

const ProfileContext = createContext({});

export function ProfileProvider({profileService,children}) {
    const queryClient = useQueryClient();
    const {user} = useAuth();
    const [nickname,setNickname] = useState("");
    const [imageURL,setImageURL] = useState("");
    const [statusMsg,setStatusMsg] = useState("");

    const {data:profile, error} = useQuery(["profile",user],()=>profileService.getProfile(),{staleTime:Infinity, enabled: !!user});
    if(error) console.log(error);

    useEffect(()=>{
        if(profile) {
            setNickname(profile.nickname);
            setImageURL(profile.imageURL);
            setStatusMsg(profile.statusMsg);
        }
    },[profile])

    const updateMsg = useMutation((statusMsg)=>profileService.updateStatusMsg(statusMsg),{onSuccess: () => {queryClient.invalidateQueries(["profile"])}});

    const updateImg = useMutation((formData)=>profileService.updateProfileImg(formData),{onSuccess: () => {queryClient.invalidateQueries(["profile"])}});

    const context = useMemo(()=>{
        return {nickname, imageURL, statusMsg, error,updateImg,updateMsg};
    },[profile,error,updateImg,updateMsg])
    
    return (
        <ProfileContext.Provider value={context}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    return useContext(ProfileContext);
}