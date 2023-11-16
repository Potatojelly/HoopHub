import { createContext, useContext, useMemo, useState } from 'react';

const ChatRoomsContext = createContext({});

export const ChatRoomsProvider = ({children}) => {
    const [chatRooms, setChatRooms] = useState(null);

    const context = useMemo(()=>{
        return {chatRooms,setChatRooms};
    },[chatRooms])

    return (
        <ChatRoomsContext.Provider value={context}>
            {children}
        </ChatRoomsContext.Provider>
    )
}

export const useChatRooms = () => {
    return useContext(ChatRoomsContext);
}