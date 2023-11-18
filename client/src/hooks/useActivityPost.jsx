import {useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { getAuthErrorEventBus} from '../context/AuthContext';
import { useState } from 'react';
import HttpClient from '../network/http';
import PostService from '../service/post';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const postService = new PostService(httpClient);
const DISPLAYPAGENUM = 5;
const POSTSPERPAGE = 10;
export default function useActivityPostPage() {
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
        const result = (end_page == total_page) ? false : true;
        setHasNext(result);
    }

    const setPageInfo = (totalPosts, currentPage) => {
        getTotalPage(totalPosts);
        getStartPage(currentPage);
        getEndPage(currentPage,totalPosts);
    }


    const handlePrevious = (setCurrentPage) => {
        const page = startPage-DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['myPosts', page]);
    }

    const handleNext = (setCurrentPage) => {
        const page = startPage+DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['myPosts', page]);
    }

    const handlePage = (startPage,index,setCurrentPage) => {
        const page = startPage + index;
        setCurrentPage(page);
        queryClient.invalidateQueries(['myPosts', page]);
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

export function useUserPostsData(nickname,currentPage) {
    return useQuery(["user-posts",nickname,currentPage],()=>postService.getUserPosts(nickname,currentPage,POSTSPERPAGE),
                                                                    {
                                                                        onSuccess: (result) => {
                                                                            console.log(result);
                                                                        },
                                                                        keepPreviousData:true,
                                                                        refecthOnMount: true, 
                                                                        refetchOnWindowFocus: false
                                                                    });
}