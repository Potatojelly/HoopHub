import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const DISPLAYPAGENUM = 5;
const COMMENTSPERPAGE = 10;
export default function useMyComment(postService,page) {
    const queryClient = useQueryClient();
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(page ? page : 1);
    // const [postTotalComments,setPostTotalComments] = useState(undefined);
    const [totalComments,setTotalComments] = useState(undefined);
    const [startPage,setStartPage] = useState(undefined);
    const [endPage,setEndPage] = useState(undefined);
    const [hasPrev,setHasPrev] = useState(undefined);
    const [hasNext,setHasNext] = useState(undefined);

    const getTotalComments = (totalComments, commentsPerPage) => {
        return parseInt(((totalComments - 1)/commentsPerPage) + 1);
    }

    const getStartPage = (currentPage, displayPageNum) => {
        return (parseInt((currentPage-1)/displayPageNum)) * displayPageNum + 1;
    }

    const getEndPage = (currentPage, displayPageNum, totalComments) => {
        let endPage = (parseInt(((currentPage-1)/displayPageNum))+1) * displayPageNum;
        if(totalComments < endPage) {
            endPage = totalComments;
        }
        return endPage;
    }

    const getHasPrev = (startPage) => {
        return (startPage === 1) ? false : true;
    }

    const getHasNext = (endPage, totalComments) => {
        return (endPage == totalComments) ? false : true;
    }

    const setPageInfo = (totalPages, currentPage) => {
        const tmpStartPage = getStartPage(currentPage,DISPLAYPAGENUM) 
        setStartPage(tmpStartPage);
        const tmpEndPage = getEndPage(currentPage,DISPLAYPAGENUM,totalPages) 
        setEndPage(tmpEndPage);
        setHasPrev(getHasPrev(tmpStartPage));
        setHasNext(getHasNext(tmpEndPage,totalPages));
    }

    const {data}= useQuery(["Mycomments", currentPage],()=>postService.getMyComments(currentPage,COMMENTSPERPAGE),
                                                                    {
                                                                        staleTime:1000 * 60 * 1,
                                                                        onSuccess: (result) => {
                                                                            setComments(result.my_comments);
                                                                            // setPostTotalComments(result.total_comments);
                                                                            const tmpTotalComments = getTotalComments(result.total_comments,result.comments_per_page);
                                                                            setTotalComments(tmpTotalComments);
                                                                            setPageInfo(tmpTotalComments,currentPage);
                                                                        },
                                                                    });

    useEffect(()=>{
        queryClient.invalidateQueries(['Mycomments', currentPage]);
    }
    ,[page])

    const handlePrevious = () => {
        const page = endPage-DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['Mycomments', page]);
    }

    const handleNext = () => {
        const page = startPage+DISPLAYPAGENUM
        console.log(page);
        setCurrentPage(page)
        queryClient.invalidateQueries(['Mycomments', page]);
    }

    const handlePage = (startPage,index) => {
        const page = startPage + index;
        setCurrentPage(page);
        queryClient.invalidateQueries(['Mycomments', page]);
    }

    return {
        comments,
        currentPage,
        totalComments,
        startPage,
        endPage,
        hasPrev,
        hasNext,
        handlePrevious,
        handleNext,
        handlePage
    };
}