import { createContext, useContext, useMemo, useState } from 'react';

const LastReadMessageContext = createContext();

export const LastReadMessageProvider = ({children}) => {
    const [lastReadMessage, setLastReadMessage] = useState(null);

    const context = useMemo(()=>{
        return {lastReadMessage,setLastReadMessage};
    },[lastReadMessage])

    return (
        <LastReadMessageContext.Provider value={context}>
            {children}
        </LastReadMessageContext.Provider>
    )
}

export const useLastReadMessage = () => {
    return useContext(LastReadMessageContext);
}