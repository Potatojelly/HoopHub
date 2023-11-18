import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { getAuthErrorEventBus, useAuth } from '../context/AuthContext';
import HttpClient from '../network/http';
import FriendService from '../service/friend';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const friendService = new FriendService(httpClient);

export function useFriendData() {
    const {user} = useAuth();
    return useQuery(["myFriend",user],()=>friendService.getMyFriend(),{
                                                                        staleTime: 0,
                                                                        refetchOnWindowFocus: false,
                                                                        refetchOnMount: true,
                                                                        enabled: !!user
                                                                        });
}

export function useFriendRequestData() {
    const {user} = useAuth();
    return useQuery(["myRequest",user],()=>friendService.getMyFriendRequest(),{
                                                                                staleTime: 0,
                                                                                refetchOnWindowFocus: false,
                                                                                refetchOnMount: true,
                                                                                enabled: !!user
                                                                                });
}

export function useFriendRequestReceivedData() {
    const {user} = useAuth();
    return useQuery(["receviedRequest",user],()=>friendService.getReceivedFriendRequest(),{
                                                                                            staleTime: 0,
                                                                                            refetchOnWindowFocus: false,
                                                                                            refetchOnMount: true,
                                                                                            enabled: !!user
                                                                                            });
}

export function useDeleteFriend() {
    const {user} = useAuth();
    const queryClient = useQueryClient();
    return useMutation((nickname)=>friendService.deleteMyFriend(nickname),{onSuccess: ()=>queryClient.invalidateQueries(["myFriend",user])});
}

export function useSendFriendRequest() {
    return useMutation((nickname)=>friendService.sendFriendRequest(nickname));
}

export function useCancelFriendRequest() {
    return useMutation((nickname)=>friendService.cancelMyFriendRequest(nickname));
}

export function useAcceptFriendRequest() {
    const {user} = useAuth();
    const queryClient = useQueryClient();
    return useMutation((nickname)=>friendService.acceptFriendRequest(nickname),{onSuccess: ()=>queryClient.invalidateQueries(["myFriend",user])});
}

export function useRejectFriendRequest() {
    return useMutation((nickname)=>friendService.rejectFriendRequest(nickname));
}
