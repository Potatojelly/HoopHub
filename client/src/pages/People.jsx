import React, { useEffect, useState } from 'react';
import styles from './People.module.css'
import UserSearchResultCard from "../components/User/UserSearchResultCard";
import {useQueryClient} from "@tanstack/react-query";
import {v4 as uuidv4} from "uuid";
import FriendRequest from '../components/Friend/FriendRequest';
import FriendReceivedRequest from '../components/Friend/FriendReceivedRequest';
import { useFriendRequestData, useFriendRequestReceivedData } from "../hooks/useFriendData";
import { useUserSearchData } from '../hooks/useUserSearchData';

export default function People() {    
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTask,setSelectedTask] = useState(1);

    const {data: users, error} = useUserSearchData(searchTerm);
    const {data: myFriendRequest} = useFriendRequestData();
    const {data: receivedFriendRequest} = useFriendRequestReceivedData();

    async function handleSearch(e) {
        const term = e.target.value;
        setSearchTerm(term);
    }

    useEffect(() => {
        if (users && searchTerm !== "") {
            const filteredResults = users.data.filter((user) =>
                user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
        }
    }, [users,searchTerm]);
    
    const handleTaskBtn = (e) => {
        setSelectedTask(parseInt(e.target.id));
        if(parseInt(e.target.id) === 2) {
            queryClient.invalidateQueries(["myRequest"]);
        } else if (parseInt(e.target.id) === 3) {
            queryClient.invalidateQueries(["receivedRequest"]);
        }
        setSearchResults([]);
        setSearchTerm("");
    }
    
    return (
        <div className={styles.searchFriendsContainer}>
            <div className={styles.searchFriendsSubContainer}>
                <h1 className={styles.pageName}>Manage Friends Request</h1>
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
                                                friendship={user.status}/>
                        ))}
                    </ul>
                </>}
                {selectedTask===2 && 
                <>
                    <ul className={styles.searchResultsContainer}>
                        <div className={styles.searchResultsTitle}>My Requests List</div>
                        {!myFriendRequest && <div className={styles.noContent}>No Requests</div>}
                        {myFriendRequest && myFriendRequest.myRequest.map((myRequest) => (
                            <FriendRequest key={uuidv4()} 
                                        nickname={myRequest.nickname} 
                                        imageURL={myRequest.imageURL}/>
                        ))}
                    </ul>
                </>}
                {selectedTask===3 && 
                <>
                    <ul className={styles.searchResultsContainer}>
                        <div className={styles.searchResultsTitle}>Received Requests List</div>
                        {!receivedFriendRequest && <div className={styles.noContent}>No Received Requests</div>}
                        {receivedFriendRequest && receivedFriendRequest.receivedRequest.map((request) => (
                            <FriendReceivedRequest key={uuidv4()} 
                                                nickname={request.nickname} 
                                                imageURL={request.imageURL}/>
                        ))}
                    </ul>
                </>}
            </div>
        </div>
    );
}

