import React, { useEffect, useState } from 'react';
import styles from './People.module.css'
import UserSearchResultCard from "../components/User/UserSearchResultCard";
import {v4 as uuidv4} from "uuid";
import FriendRequest from '../components/Friend/FriendRequest';
import FriendReceivedRequest from '../components/Friend/FriendReceivedRequest';
import useFriend from "../hooks/useFriend";

export default function People({searchService,friendService}) {    
    const [users,setUsers] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [error,setError] = useState("");
    const [isFetched,setFetched] = useState(false);
    const [selectedTask,setSelectedTask] = useState(1);


    const {myFriendRequest,
        receivedFriendRequest, 
        refetchMyFriendRequest,
        refetchReceivedRequest} = useFriend(friendService);

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
            setFetched(false);
        }
    }, [users,searchTerm]);
    
    const handleTaskBtn = (e) => {
        setSelectedTask(parseInt(e.target.id));
        if(parseInt(e.target.id) === 2) {
            refetchMyFriendRequest();    
        } else if (parseInt(e.target.id) === 3) {
            refetchReceivedRequest();
        }
        setSearchResults([]);
        setSearchTerm("");
    }
    
    return (
        <div className={styles.searchFriendsContainer}>
            <div className={styles.searchFriendsSubContainer}>
                <h1 className={styles.title}>Manage Friends Request</h1>
                <div className={styles.taskContainer}>
                    <button id={1} className={`${styles.taskBtn} ${selectedTask===1 && styles.selectedTask}`} onClick={handleTaskBtn}>
                        Search Users
                    </button>
                    <button id={2} className={`${styles.taskBtn} ${selectedTask===2 && styles.selectedTask}`} onClick={handleTaskBtn}>
                        My Requests
                    </button>
                    <button id={3} className={`${styles.taskBtn} ${selectedTask===3 && styles.selectedTask}`} onClick={handleTaskBtn}>
                        Received Requests
                    </button>
                </div>
                {selectedTask===1 && 
                <>
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
                            <UserSearchResultCard key={uuidv4()} 
                                                imageURL={user.imageURL} 
                                                nickname={user.nickname} 
                                                friendship={user.status}
                                                friendService={friendService}/>
                        ))}
                    </ul>
                </>}
                {selectedTask===2 && 
                <>
                    <ul className={styles.searchResultsContainer}>
                        <div className={styles.searchResultsTitle}>My Requests List</div>
                        {!myFriendRequest && <div className={styles.noContent}>No Requests</div>}
                        {myFriendRequest && myFriendRequest.map((myRequest) => (
                            <FriendRequest key={uuidv4()} 
                                        nickname={myRequest.nickname} 
                                        imageURL={myRequest.imageURL}
                                        friendService={friendService}/>
                        ))}
                    </ul>
                </>}
                {selectedTask===3 && 
                <>
                    <ul className={styles.searchResultsContainer}>
                        <div className={styles.searchResultsTitle}>Received Requests List</div>
                        {!receivedFriendRequest && <div className={styles.noContent}>No Received Requests</div>}
                        {receivedFriendRequest && receivedFriendRequest.map((request) => (
                            <FriendReceivedRequest key={uuidv4()} 
                                                nickname={request.nickname} 
                                                imageURL={request.imageURL}
                                                friendService={friendService}/>
                        ))}
                    </ul>
                </>}
            </div>
        </div>
    );
}

