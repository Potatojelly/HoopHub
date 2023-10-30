import { createContext, useContext, useMemo, useState } from 'react';

const MyActivityContext = createContext();

export const MyActivityProvider = ({children}) => {
    const [selectedMyActivityPostID,setMyActivityPostID] = useState(null);
    const [selectedCommentType,setCommentType] = useState(null);
    const [selectedCommentPage,setCommentPage] = useState(null);
    const [selectedCommentID,setCommentID] = useState(null);

    const context = useMemo(()=>{
        return {selectedMyActivityPostID,selectedCommentID,selectedCommentPage,selectedCommentType,
                setCommentPage,setCommentType,setCommentID,setMyActivityPostID}
    },[selectedMyActivityPostID,selectedCommentID,selectedCommentPage,selectedCommentType])

    return (
        <MyActivityContext.Provider value={context}>
            {children}
        </MyActivityContext.Provider>
    )
}

export const useMyActivityContext = () => {
    return useContext(MyActivityContext);
}