import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { getAuthErrorEventBus, useAuth } from '../context/AuthContext';
import { useState } from 'react';
import HttpClient from '../network/http';
import PostService from "../service/post";
import {useNavigate} from "react-router-dom";

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const postService = new PostService(httpClient);
const DISPLAYPAGENUM = 5;
const POSTSPERPAGE = 5;

export function usePostPage(keyword) {
    const queryClient = useQueryClient();
    const [totalPage,setTotalPage] = useState(undefined);
    const [startPage,setStartPage] = useState(undefined);
    const [endPage,setEndPage] = useState(undefined);
    const [hasPrev,setHasPrev] = useState(undefined);
    const [hasNext,setHasNext] = useState(undefined);

    const getTotalPage = (totalPosts) => {
        const total_page = parseInt(((totalPosts - 1)/POSTSPERPAGE) + 1);
        setTotalPage(total_page);
    }

    const getStartPage = (currentPage) => {
        const start_page = (parseInt((currentPage-1)/DISPLAYPAGENUM)) * DISPLAYPAGENUM + 1;
        setStartPage(start_page);
        const result = (start_page === 1) ? false : true;
        setHasPrev(result);
    }

    const getEndPage = (currentPage, totalPosts) => {
        const total_page = parseInt(((totalPosts - 1)/POSTSPERPAGE) + 1);
        let end_page = (parseInt(((currentPage-1)/DISPLAYPAGENUM))+1) * DISPLAYPAGENUM;
        if(total_page < end_page) {
            end_page = total_page;
        }
        setEndPage(end_page);
        const result = (end_page === total_page) ? false : true;
        setHasNext(result);
    }


    const setPageInfo = (totalPosts, currentPage) => {
        getTotalPage(totalPosts);
        getStartPage(currentPage);
        getEndPage(currentPage,totalPosts);
    }

    const handlePrevious = (setCurrentPage,setSelectedPage) => {
        const page = startPage-DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['posts', keyword, page]);
    }

    const handleNext = (setCurrentPage,setSelectedPage) => {
        const page = startPage+DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['posts', keyword, page]);
    }

    const handlePage = (startPage,index,setCurrentPage,setSelectedPage) => {
        const page = startPage + index;
        setCurrentPage(page);
        queryClient.invalidateQueries(['posts', keyword, page]);
    }

    return {
        totalPage,
        startPage,
        endPage,
        hasPrev,
        hasNext,
        handlePrevious,
        handleNext,
        handlePage,
        setPageInfo,
    };
}

export function usePostsData(currentPage,keyword) {
    return useQuery(["posts", keyword, currentPage],()=>postService.getPosts(keyword, currentPage, POSTSPERPAGE),
                                                                    {
                                                                        cacheTime: 0,
                                                                        staleTime: 0,
                                                                        refetchOnMount: true, 
                                                                        refetchOnWindowFocus: false
                                                                    });
}

export function usePostData(selectedPostID) {
    const navigate = useNavigate();
    const {user} = useAuth();
    return useQuery(["post", selectedPostID],()=>postService.getPost(selectedPostID),
                                                                    {
                                                                        onSuccess: (res) => {
                                                                            if(res.post.deleted === 1) {
                                                                                alert(`The post "${res.post.title}" has been deleted!`);
                                                                                navigate('/', {replace: true} );
                                                                            }
                                                                        },
                                                                        enabled: !!user,
                                                                        cacheTime: 0,
                                                                        staleTime:0,
                                                                        retry:false,
                                                                        refetchOnMount: true, 
                                                                        refetchOnWindowFocus: false
                                                                    });
}

export function useCreatePost() {
    return useMutation((data)=>{const {formData,signal,callback} = data; return postService.createPost(formData,signal,callback)},{retry:false});
}

export function useDeletePost() {
    return useMutation((selectedPostID)=>postService.deletePost(selectedPostID));
}

export function useUpdatePost() {
    return useMutation((data)=>{const {formData,selectedPostID,signal,callback} = data; return postService.updatePost(formData,selectedPostID,signal,callback)},{retry:false});
}

export function useUpdatePostView() {
    const queryClient = useQueryClient();
    return useMutation((selectedPostID)=>postService.updateView(selectedPostID),{onSuccess:()=>{queryClient.invalidateQueries(['posts'])}});
}