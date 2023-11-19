import {useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { getAuthErrorEventBus, useAuth } from '../context/AuthContext';
import { useState } from 'react';
import HttpClient from '../network/http';
import PostService from '../service/post';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = getAuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const postService = new PostService(httpClient);
const DISPLAYPAGENUM = 5;
const COMMENTSPERPAGE = 10;
export default function useActivityCommentPage() {
    const queryClient = useQueryClient();
    const [totalPage,setTotalPage] = useState(undefined);
    const [startPage,setStartPage] = useState(undefined);
    const [endPage,setEndPage] = useState(undefined);
    const [hasPrev,setHasPrev] = useState(undefined);
    const [hasNext,setHasNext] = useState(undefined);

    const getTotalPage = (totalComments) => {
        const total_page = parseInt(((totalComments - 1)/COMMENTSPERPAGE) + 1);
        setTotalPage(total_page);
    }

    const getStartPage = (currentPage) => {
        const start_page = (parseInt((currentPage-1)/DISPLAYPAGENUM)) * DISPLAYPAGENUM + 1;
        setStartPage(start_page);
        const result = (start_page === 1) ? false : true;
        setHasPrev(result);
    }

    const getEndPage = (currentPage, totalComments) => {
        const total_page = parseInt(((totalComments - 1)/COMMENTSPERPAGE) + 1);
        let end_page = (parseInt(((currentPage-1)/DISPLAYPAGENUM))+1) * DISPLAYPAGENUM;
        if(total_page < end_page) {
            end_page = total_page;
        }
        setEndPage(end_page);
        const result = (end_page === total_page) ? false : true;
        setHasNext(result);
    }

    const setPageInfo = (totalComments, currentPage) => {
        getTotalPage(totalComments);
        getStartPage(currentPage);
        getEndPage(currentPage,totalComments);
    }

    const handlePrevious = (setCurrentPage) => {
        const page = startPage-DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['Mycomments', page]);
    }

    const handleNext = (setCurrentPage) => {
        const page = startPage+DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['Mycomments', page]);
    }

    const handlePage = (startPage,index,setCurrentPage) => {
        const page = startPage + index;
        setCurrentPage(page)
        queryClient.invalidateQueries(['Mycomments', page]);
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
        setPageInfo
    };
}

export function useUserCommentsData(nickname, currentPage) {
    const {user} = useAuth();
    return useQuery(["user-comments", nickname, currentPage],()=>postService.getUserComments(nickname,currentPage,COMMENTSPERPAGE),
                                                                                {
                                                                                    onSuccess: (result) => {
                                                                                        // console.log(result);
                                                                                    },
                                                                                    refecthOnMount: true, 
                                                                                    refetchOnWindowFocus: false,
                                                                                    enable:!!user
                                                                                });
}