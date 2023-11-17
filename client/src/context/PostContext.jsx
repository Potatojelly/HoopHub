import { createContext, useContext, useMemo, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({children}) => {
    const [selectedPage,setSelectedPage] = useState(null);
    const [selectedPostID,setSelectedPostID] = useState(null);

    const context = useMemo(()=>{
        return {selectedPage,selectedPostID,setSelectedPage,setSelectedPostID}
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