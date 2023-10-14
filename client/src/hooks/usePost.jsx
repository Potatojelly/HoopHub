import {useMutation,useQueryClient} from "@tanstack/react-query";
import {useQuery} from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const DISPLAYPAGENUM = 5;
const POSTSPERPAGE = 5;
export default function usePost(postService,page) {
    const queryClient = useQueryClient();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(page ? page : 1);
    const [totalPage,setTotalPage] = useState(undefined);
    const [startPage,setStartPage] = useState(undefined);
    const [endPage,setEndPage] = useState(undefined);
    const [hasPrev,setHasPrev] = useState(undefined);
    const [hasNext,setHasNext] = useState(undefined);

    const getTotalPages = (totalPosts, postsPerPage) => {
        return parseInt(((totalPosts - 1)/postsPerPage) + 1);
    }

    const getStartPage = (currentPage, displayPageNum) => {
        return (parseInt((currentPage-1)/displayPageNum)) * displayPageNum + 1;
    }

    const getEndPage = (currentPage, displayPageNum, totalPages) => {
        let endPage = (parseInt(((currentPage-1)/displayPageNum))+1) * displayPageNum;
        if(totalPages < endPage) {
            endPage = totalPages;
        }
        return endPage;
    }

    const getHasPrev = (startPage) => {
        return (startPage === 1) ? false : true;
    }

    const getHasNext = (endPage, totalPages) => {
        return (endPage == totalPages) ? false : true;
    }

    const setPageInfo = (totalPage, currentPage) => {
        const tmpStartPage = getStartPage(currentPage,DISPLAYPAGENUM) 
        setStartPage(tmpStartPage);
        const tmpEndPage = getEndPage(currentPage,DISPLAYPAGENUM,totalPage) 
        setEndPage(tmpEndPage);
        setHasPrev(getHasPrev(tmpStartPage));
        setHasNext(getHasNext(tmpEndPage,totalPage));
    }

    const {data}= useQuery(["posts",currentPage],()=>postService.getPosts(currentPage,POSTSPERPAGE),
                                                                    {
                                                                        staleTime:1000 * 60 * 1,
                                                                        onSuccess: (result) => {
                                                                            setPosts(result.posts);
                                                                            const tmpTotalPage = getTotalPages(result.total_posts,result.posts_per_page);
                                                                            setTotalPage(tmpTotalPage);
                                                                            setPageInfo(tmpTotalPage,currentPage);
                                                                        },
                                                                    });

    useEffect(()=>{
        if(data) {
            queryClient.invalidateQueries(['posts', currentPage]);
        }
    }
    ,[posts])

    const handlePrevious = () => {
        const page = currentPage-DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['posts', page]);
    }

    const handleNext = () => {
        const page = currentPage+DISPLAYPAGENUM
        setCurrentPage(page)
        queryClient.invalidateQueries(['posts', page]);
    }

    const handlePage = (startPage,index) => {
        const page = startPage + index;
        setCurrentPage(page);
        queryClient.invalidateQueries(['posts', page]);
    }

    return {
        posts,
        currentPage,
        totalPage,
        startPage,
        endPage,
        hasPrev,
        hasNext,
        handlePrevious,
        handleNext,
        handlePage
    };
}