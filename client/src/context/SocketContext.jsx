import { createContext, useContext, useMemo, useState } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);

    const context = useMemo(()=>{
        return {socket,setSocket};
    },[socket])

    return (
        <SocketContext.Provider value={context}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket= () => {
    return useContext(SocketContext);
}