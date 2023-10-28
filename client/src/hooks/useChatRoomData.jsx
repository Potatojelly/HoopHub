import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery,useInfiniteQuery} from '@tanstack/react-query';
import { useSelectedCard } from '../context/SelectedCardContext';
import { useEffect, useState } from 'react';
import { AuthErrorEventBus } from '../context/AuthContext';
import HttpClient from '../network/http';
import ChatService from '../service/chat';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const chatService = new ChatService(httpClient);

export function useChatRooms() {
    return useQuery(["direct-chatrooms"],()=>chatService.getMyChatRooms(),         
                                                    {
                                                        cacheTime: 0,
                                                        staleTime:1000 * 60 * 1,
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
                                                        refetchOnMount: true,
                                                    })    
}

export function useChatRoomMessage(chatRoomID) {
    return useInfiniteQuery(["direct-chatroom-message",chatRoomID],({pageParam = 0})=>chatService.getMessage(chatRoomID,pageParam),         
                                                                                {
                                                                                    getPreviousPageParam : (lastPage, allPages) => {
                                                                                        console.log(allPages);
                                                                                        return lastPage.result.length !== 0 ? lastPage.currentPage+1 : undefined;
                                                                                    },
                                                                                    cacheTime: 1000 * 60 * 5,
                                                                                    staleTime:1000 * 60 * 5,
                                                                                    select: (data) => {
                                                                                        let newData = [];
                                                                                        data.pages.forEach((ele)=>{newData=[...newData, ...ele.result]});
                                                                                        return newData;
                                                                                    },
                                                                                    refetchOnWindowFocus: false,
                                                                                    refetchOnMount: true,
                                                                                    onSuccess:()=>{console.log("check!")}
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
                                                        cacheTime: 1000 * 60 * 1,
                                                        staleTime: 0,
                                                        select: (data) => {
                                                            return data.result;
                                                        },
                                                        refetchOnMount: true,
                                                        onSuccess: (data) => {
                                                            console.log(data);
                                                        }
                                                    })    
}


export function useSaveLastReadMessage() {
    const queryClient = useQueryClient();
    return useMutation((chatRoomID)=>chatService.saveLastReadMessage(chatRoomID),
                                {onSuccess:(result)=>{}})
}

export function useAddChatRoom() {
    const queryClient = useQueryClient();
    return useMutation((opponentID)=>chatService.createChatRoom(opponentID),{onSuccess:()=>{queryClient.invalidateQueries(["direct-chatrooms"])}})
}

export function useSendMessage() {
    const queryClient = useQueryClient();
    return useMutation((data)=>{const {chatRoomID, content, init} = data; return chatService.sendMessage(content,chatRoomID,init)},{onSuccess:(response)=>{
        queryClient.invalidateQueries(["direct-chatroom-message",response.result.chat])}})
}

export function useSendImageMessage() {
    const queryClient = useQueryClient();
    return useMutation((formData)=>chatService.sendImageMessage(formData),{onSuccess:(response)=>{
        // queryClient.invalidateQueries(["direct-chatroom-message",response.result.chat])
    }})
}