import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery,useInfiniteQuery} from '@tanstack/react-query';
import { getAuthErrorEventBus } from '../context/AuthContext';
import HttpClient from '../network/http';
import ChatService from '../service/chat';
import {useNavigate} from "react-router-dom";

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const chatService = new ChatService(httpClient);

export function useChatRoomsData() {
    return useQuery(["direct-chatrooms"],()=>chatService.getMyChatRooms(),         
                                                    {
                                                        staleTime: 0,
                                                        select: (data) => {
                                                            data.chats.sort((a, b) => {
                                                                if (a.latestMessage && b.latestMessage) {
                                                                    return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
                                                                } else if (a.latestMessage) {
                                                                    return -1; 
                                                                } else if (b.latestMessage) {
                                                                    return 1;  
                                                                } else {
                                                                    return 0;  
                                                                }
                                                            })
                                                            return data.chats;
                                                        },
                                                        refetchOnWindowFocus: false,
                                                        refetchOnMount: true,
                                                    })    
}

export function useChatRoomMessageData(chatRoomID) {
    const navigate = useNavigate();
    return useInfiniteQuery(["direct-chatroom-message",chatRoomID],({pageParam = 0})=>chatService.getMessage(chatRoomID,pageParam),         
                                                                                {
                                                                                    getPreviousPageParam : (lastPage, allPages) => {
                                                                                        return lastPage.result.length !== 0 ? lastPage.prevOffset + lastPage.result.length : undefined;
                                                                                    },
                                                                                    staleTime: 0,
                                                                                    select: (data) => {
                                                                                        const newData = data?.pages.reduce((prev,cur)=>{
                                                                                            return [...prev,...cur.result];
                                                                                        },[]);
                                                                                        if(!newData[newData.length-1].realTime) newData[newData.length-1].realTime = false;
                                                                                        return newData;
                                                                                    },
                                                                                    refetchOnWindowFocus: false,
                                                                                    onError: (err) => {
                                                                                        if(err.message === "Unauthorized") {
                                                                                            window.alert("You do not have authorization to access the chat room!");
                                                                                            navigate("/");
                                                                                        }
                                                                                    }
                                                                                })    
}

export function useUpdateChatRoomMessage(chatRoomID,newMessage) {
    const queryClient = useQueryClient();
    queryClient.setQueryData(["direct-chatroom-message",chatRoomID], (oldData)=>(
        {
            ...oldData,
            pages: [
                ...oldData.pages.slice(0,oldData.pages.length-1),
                {
                    result: [...oldData.pages[oldData.pages.length-1].result, newMessage],
                }
            ],
        }
    ));
}

export function useUnreadMessageNumber(chatRoomID) {
    return useQuery(["unread-message-counter",chatRoomID],()=>chatService.getUnreadMessageNumber(chatRoomID),         
                                                    {
                                                        cacheTime: 0,
                                                        staleTime: 0,
                                                        select: (data) => {
                                                            return data.result;
                                                        },
                                                        refetchOnMount: true,
                                                    })    
}


export function useSaveLastReadMessage() {
    return useMutation((chatRoomID)=>chatService.saveLastReadMessage(chatRoomID),)
}

export function useAddChatRoom() {
    const queryClient = useQueryClient();
    return useMutation((data)=>{const {participants,chatName} = data; return chatService.createChatRoom(participants,chatName)},{onSuccess:()=>{
        queryClient.invalidateQueries(["direct-chatrooms"])}})
}

export function useExitChatRoom() {
    return useMutation((chatRoomID)=>chatService.exitChatRoom(chatRoomID))
}

export function useKickoutUser() {
    return useMutation((data)=>{const {chatRoomID,kickedUser} = data; return chatService.kickoutUser(kickedUser,chatRoomID)})
}

export function useChatName() {
    return useMutation((data)=>{const {chatRoomID,chatName} = data; return chatService.changeChatName(chatRoomID,chatName)})
}

export function useInviteUsers() {
    return useMutation((data)=>{const {chatRoomID,invitedUsers} = data; return chatService.inviteUsers(chatRoomID,invitedUsers)})
}

export function useSendMessage() {
    return useMutation((data)=>{const {chatRoomID, content, init} = data; return chatService.sendMessage(content,chatRoomID,init)})
}

export function useSendImageMessage() {
    return useMutation((formData)=>chatService.sendImageMessage(formData));
}