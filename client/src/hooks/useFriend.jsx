import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

export default function useFriend(friendService) {
    const queryClient = useQueryClient();
    const {user} = useAuth();

    const {data: myFriendQuery} = useQuery(["myFriend"],()=>friendService.getMyFriend(),{staleTime:1000 * 60 * 3, enabled: !!user});
    const {data: myRequestQuery} = useQuery(["myRequest"],()=>friendService.getMyFriendRequest(),{staleTime:1000 * 60 * 3, enabled: !!user});
    const {data: receivedRequestQuery} = useQuery(["receviedRequest"],()=>friendService.getReceivedFriendRequest(),{staleTime:1000 * 60 * 3, enabled: !!user})

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