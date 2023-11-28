import {useQuery} from '@tanstack/react-query';
import { getAuthErrorEventBus } from '../context/AuthContext';
import HttpClient from '../network/http';
import ProfileService from '../service/profile';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const profileService = new ProfileService(httpClient);
export function useUserProfile(nickname) {
    return useQuery(["user-profile",nickname],()=>profileService.getUserProfile(nickname),         
                                                    {
                                                        staleTime: 0,
                                                        refetchOnWindowFocus: false,
                                                        refetchOnMount: true,
                                                    })    
}

