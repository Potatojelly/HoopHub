import {useQuery} from '@tanstack/react-query';
import { getAuthErrorEventBus, useAuth } from '../context/AuthContext';
import HttpClient from '../network/http';
import SearchService from '../service/search';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const searchService = new SearchService(httpClient);

export function useUserSearchData(term) {
    const {user} = useAuth();
    return useQuery(["users",term],()=>searchService.searchUser(term), {
                                                                        staleTime: 0,
                                                                        refetchOnWindowFocus: false,
                                                                        refetchOnMount: true,
                                                                        enabled: !!user,
                                                                        retry: false,
                                                                        enabled: !!term,
                                                                        });
}
