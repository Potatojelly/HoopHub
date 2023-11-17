import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { getAuthErrorEventBus, useAuth } from '../context/AuthContext';
import HttpClient from '../network/http';
import FriendService from '../service/friend';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const friendService = new FriendService(httpClient);

export default function useFriend(friendService) {
    const queryClient = useQueryClient();
    const {user} = useAuth();

    const {data: myFriendQuery} = useQuery(["myFriend",user],()=>friendService.getMyFriend(),{staleTime:1000 * 60 * 3, enabled: !!user});
    const {data: myRequestQuery} = useQuery(["myRequest",user],()=>friendService.getMyFriendRequest(),{staleTime:1000 * 60 * 3, enabled: !!user});
    const {data: receivedRequestQuery} = useQuery(["receviedRequest",user],()=>friendService.getReceivedFriendRequest(),{staleTime:1000 * 60 * 3, enabled: !!user})

    const myFriend = myFriendQuery && myFriendQuery.myFriend;
    const myFriendRequest = myRequestQuery && myRequestQuery.myRequest;
    const receivedFriendRequest =  receivedRequestQuery && receivedRequestQuery.receivedRequest;

    const refetchMyFriendRequest = () => {
        queryClient.refetchQueries("myRequest");
    }

    const refetchReceivedRequest = () => {
        queryClient.refetchQueries("receivedRequest");
    }

    const deleteFriend = useMutation((nickname)=>friendService.deleteMyFriend(nickname),{onSuccess: ()=>queryClient.invalidateQueries(["myFriend"])});
    const sendRequest = useMutation((nickname)=>friendService.sendFriendRequest(nickname));
    const cancelRequest = useMutation((nickname)=>friendService.cancelMyFriendRequest(nickname));
    const acceptRequest = useMutation((nickname)=>friendService.acceptFriendRequest(nickname));
    const rejectRequest = useMutation((nickname)=>friendService.rejectFriendRequest(nickname));
    
    return {myFriend, myFriendRequest, receivedFriendRequest,
            refetchMyFriendRequest,refetchReceivedRequest,
            sendRequest, cancelRequest, acceptRequest, rejectRequest, deleteFriend};
}

export function useFriendData() {
    const {user} = useAuth();
    return useQuery(["myFriend",user],()=>friendService.getMyFriend(),{
                                                                        refetchOnWindowFocus: false,
                                                                        refetchOnMount: true,
                                                                        enabled: !!user
                                                                        });
}

export function useFriendRequestData() {
    const {user} = useAuth();
    return useQuery(["myRequest",user],()=>friendService.getMyFriendRequest(),{
                                                                                refetchOnWindowFocus: false,
                                                                                refetchOnMount: true,
                                                                                enabled: !!user
                                                                                });
}

export function useFriendRequestReceivedData() {
    const {user} = useAuth();
    return useQuery(["receviedRequest",user],()=>friendService.getReceivedFriendRequest(),{
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
