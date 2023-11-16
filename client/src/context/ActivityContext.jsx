import { createContext, useContext, useMemo, useState } from 'react';

const ActivityContext = createContext();

export const ActivityProvider = ({children}) => {
    const [selectedMyActivityPostID,setMyActivityPostID] = useState(null);
    const [selectedCommentType,setCommentType] = useState(null);
    const [selectedCommentPage,setCommentPage] = useState(null);
    const [selectedCommentID,setCommentID] = useState(null);

    const context = useMemo(()=>{
        return {selectedMyActivityPostID,selectedCommentID,selectedCommentPage,selectedCommentType,
                setCommentPage,setCommentType,setCommentID,setMyActivityPostID}
    },[selectedMyActivityPostID,selectedCommentID,selectedCommentPage,selectedCommentType])

    return (
        <ActivityContext.Provider value={context}>
            {children}
        </ActivityContext.Provider>
    )
}

export const useActivityContext = () => {
    return useContext(ActivityContext);
}