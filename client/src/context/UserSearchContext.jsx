import { createContext, useContext, useMemo, useState } from 'react';

const UserSearchContext = createContext();

export const UserSearchProvider = ({children}) => {
    const [userSearch,setUserSearch] = useState(false);


    const context = useMemo(()=>{
        return {userSearch,setUserSearch};
    },[userSearch])

    return (
        <UserSearchContext.Provider value={context}>
            {children}
        </UserSearchContext.Provider>
    )
}

export const useUserSearch = () => {
    return useContext(UserSearchContext);
}