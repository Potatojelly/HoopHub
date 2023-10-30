import { createContext, useContext, useMemo, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({children}) => {
    const [selectedPage,setSelectedPage] = useState(null);
    const [selectedPostID,setPostID] = useState(null);

    const context = useMemo(()=>{
        return {selectedPage,selectedPostID,setSelectedPage,setPostID}
    },[selectedPage,selectedPostID])

    return (
        <PostContext.Provider value={context}>
            {children}
        </PostContext.Provider>
    )
}

export const usePostContext = () => {
    return useContext(PostContext);
}