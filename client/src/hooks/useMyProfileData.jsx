import { getAuthErrorEventBus, useAuth } from '../context/AuthContext';
import HttpClient from '../network/http';
import ProfileService from '../service/profile';
import {useQueryClient, useQuery, useMutation} from "@tanstack/react-query";


const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const profileService = new ProfileService(httpClient);

export function useMyProfileData() {
    const {user} = useAuth();
    return useQuery(["profile",user],()=>profileService.getProfile(),{
                                                                    staleTime:Infinity,
                                                                    refetchOnWindowFocus: false,
                                                                    refetchOnMount: true,
                                                                    enabled: !!user
                                                                });
}

export function useEditProfileImage() {
    const queryClient = useQueryClient();
    return useMutation((formData)=>profileService.updateProfileImg(formData),{onSuccess: () => {queryClient.invalidateQueries(["profile"])}});
}

export function useEditStatusMessage() {
    const queryClient = useQueryClient();
    return useMutation((statusMsg)=>profileService.updateStatusMsg(statusMsg),{onSuccess: () => {queryClient.invalidateQueries(["profile"])}});
}