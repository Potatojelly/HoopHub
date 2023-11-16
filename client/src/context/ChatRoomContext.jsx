import { createContext, useContext, useMemo, useState } from 'react';

const ChatRoomContext = createContext({});

export const ChatRoomProvider = ({children}) => {
    const [chatRoomID, setChatRoomID] = useState(null);
    const [selectedChatRoom,setSelectedChatRoom] = useState(null);

    const selectChatRoom = (chatRoomID) => {
        setChatRoomID(chatRoomID);
    };


    const context = useMemo(()=>{
        return {chatRoomID,selectChatRoom,selectedChatRoom,setSelectedChatRoom};
    },[chatRoomID,selectedChatRoom])

    return (
        <ChatRoomContext.Provider value={context}>
            {children}
        </ChatRoomContext.Provider>
    )
}

export const useChatRoomID = () => {
    return useContext(ChatRoomContext);
}