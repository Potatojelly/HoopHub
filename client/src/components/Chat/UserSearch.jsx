import React, { useEffect, useState } from 'react';
import styles from './UserSearch.module.css'

import {v4 as uuidv4} from "uuid";
import UserSearchCard from './UserSearchCard';
import {useNavigate,useLocation} from "react-router-dom";
import {useChatRoomID } from '../../context/ChatRoomContext';
import { useAddChatRoom } from '../../hooks/useChatRoomData';
import { useUserSearch } from '../../context/UserSearchContext';

export default function UserSearch({searchService, chatService}) {
    const {state:chatRooms} = useLocation();
    const [users,setUsers] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [error,setError] = useState("");
    const [isFetched,setFetched] = useState(false);

    const [selectedUser,setSelectedUser] = useState(false);

    const {selectChatRoom} = useChatRoomID();
    // const {userSearch,setUserSearch} = useUserSearch();
    const {mutate} = useAddChatRoom();

    const navigate = useNavigate();

    async function handleSearch(e) {
        const term = e.target.value;
        setSearchTerm(term);

        if (term !== "" && !isFetched) {
            searchService.searchUser(term)
                .then((result)=>{
                    setUsers(result.data);
                    setError("");
                    setFetched(true);
                })
                .catch((error)=>{setError(error)})
        }
    }

    useEffect(() => {
        if (users && searchTerm !== "") {
            const filteredResults = users.filter((user) =>
                user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
            setUsers(""); 
            setSelectedUser(null);
            setFetched(false);
        }
    }, [users,searchTerm]);

    const startChat = () => {
        const checkChatRoom = chatRooms.find((chatRoom)=>{
            return chatRoom.users.find((user)=>user.nickname === selectedUser.nickname)
        })
        if(checkChatRoom) {
            navigate(`/messages/${selectedUser.nickname}`,{state: checkChatRoom});
        } else {
            mutate(selectedUser.id,{
                onSuccess: (result) => {
                    if(result.success === true) {
                        console.log(result);
                        selectChatRoom(result.chat.id);
                        // setUserSearch(false);
                        navigate(`/messages/${selectedUser.nickname}`, {state: result.chat});
                    }
                }
            })
        }
        // chatService.createChatRoom(selectedUser.id)
        //     .then((result)=>{
        //         if(result.success === true) {
        //             const opponent = result.chat.users.find((user)=>selectedUser.id === user.id);
        //             selectChatRoom(result.chat.id);
        //             setUserSearch(false);
        //             navigate(`/messages/${selectedUser.nickname}`, {state: {opponent}});
        //         }
        //     })
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <input
                type="text"
                placeholder="Type nickname"
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchFriendsBar}
                />
                <ul className={styles.searchResultsContainer}>
                    <div className={styles.searchResultsTitle}>Search Results</div>
                    {error && <small className={styles.errorMsg} style={{paddingLeft:"0.5rem"}}>{error.message}</small>}
                    {searchResults && searchResults.map((user) => (
                        <UserSearchCard key={uuidv4()} 
                                            userID={user.id}
                                            imageURL={user.imageURL} 
                                            nickname={user.nickname}
                                            selectedUser={selectedUser}
                                            setSelectedUser={setSelectedUser}/>
                    ))}
                </ul>
                <div className={styles.btnContainer}>
                    <button className={styles.cancelBtn} onClick={()=>{navigate("/messages")}}>Cancel</button>
                    <button className={styles.startBtn} 
                            onClick={()=>{startChat()}}
                            disabled={selectedUser ? false : true}>
                                Start Chat
                    </button>
                </div>
            </div>
        </div>
    );
}

