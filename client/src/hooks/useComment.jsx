import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { AuthErrorEventBus, useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import HttpClient from '../network/http';
import PostService from '../service/post';

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL,authErrorEventBus);
const postService = new PostService(httpClient);
const DISPLAYPAGENUM = 5;
const COMMENTSPERPAGE = 5;
export default function useComment() {
    const queryClient = useQueryClient();
    const [totalPage,setTotalPage] = useState(undefined);
    const [startPage,setStartPage] = useState(undefined);
    const [endPage,setEndPage] = useState(undefined);
    const [hasPrev,setHasPrev] = useState(undefined);
    const [hasNext,setHasNext] = useState(undefined);

    const getTotalPage = (totalComments, commentsPerPage) => {
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
        const result = (end_page == total_page) ? false : true;
        setHasNext(result);
    }

    const setPageInfo = (totalComments, currentPage) => {
        getTotalPage(totalComments);
        getStartPage(currentPage);
        getEndPage(currentPage,totalComments);
    }




    const handlePrevious = (postID,setCurrentPage) => {
        const page = startPage-DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['comments', postID, page]);
    }

    const handleNext = (postID,setCurrentPage) => {
        const page = startPage+DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['comments', postID, page]);
    }

    const handlePage = (startPage,index,postID,setCurrentPage) => {
        console.log(startPage,index);
        const page = startPage + index;
        console.log(page);
        setCurrentPage(page)
        queryClient.invalidateQueries(['comments', postID, page]);
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

export function useCommentQuery(currentPage,postID) {
    return useQuery(["comments", postID, currentPage],()=>postService.getComments(postID,currentPage,COMMENTSPERPAGE),
                                                                                        {
                                                                                            onSuccess: (result) => {
                                                                                                console.log(result);
                                                                                            },
                                                                                            keepPreviousData:true,
                                                                                            refecthOnMount: true, 
                                                                                            refetchOnWindowFocus: false
                                                                                        });
}