import React, { useEffect, useState } from 'react';
import styles from './People.module.css'
import FriendSearchResultCard from '../components/Friend/FriendSearchResultCard';
import {v4 as uuidv4} from "uuid";

export default function People({searchService}) {
    // const users = [
    //     { id: 1, nickname: 'John Doe', imageURL:"",  friendship: false},
    //     { id: 2, nickname: 'Jane Smith' , imageURL:"",  friendship:true},
    //     { id: 3, nickname: 'Alice Johnson' ,imageURL:"",  friendship:false},
    //     { id: 4, nickname: 'John Doe', imageURL:"",  friendship: false},
    //     { id: 5, nickname: 'Jane Smith' , imageURL:"",  friendship:true},
    //     { id: 6, nickname: 'Alice Johnson' ,imageURL:"",  friendship:false},
    //     { id: 7, nickname: 'John Doe', imageURL:"",  friendship: false},
    //     { id: 8, nickname: 'Jane Smith' , imageURL:"",  friendship:true},
    //     { id: 9, nickname: 'Alice Johnson' ,imageURL:"",  friendship:false},
    // ];
    
    const [users,setUsers] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error,setError] = useState("");
    const [isFetched,setFetched] = useState(false);

    async function handleSearch(e) {
        const term = e.target.value;
        setSearchTerm(term);

        if (term !== "" && !isFetched) {
        try {
            const result = await searchService.searchUser(term);
            console.log(result);
            setUsers(result.data);
            setError("");
            setFetched(true);
        } catch (error) {
            setError(error);
        }
        }

        // if (users && term !== "") {
        //     const filteredResults = users.filter((user) =>
        //         user.nickname.toLowerCase().includes(term.toLowerCase())
        //     );
        //     setSearchResults(filteredResults);
        // } else {
        //     setSearchResults([]);
        //     setUsers(""); 
        //     setFetched(false); 
        // }
    }

    useEffect(() => {
        if (users && searchTerm !== "") {
            const filteredResults = users.filter((user) =>
                user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
            setUsers(""); // 이 부분은 필요 없을 것 같습니다.
            setFetched(false); // 이 부분도 필요 없을 것 같습니다.
        }
    }, [users,searchTerm]);
    
    
    return (
        <div className={styles.searchFriendsContainer}>
            <div className={styles.searchFriendsSubContainer}>
                <h1 className={styles.title}>Search Users</h1>
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
                        <FriendSearchResultCard key={uuidv4()} imageURL={user.imageURL} nickname={user.nickname} friendship={user.status}/>
                    ))}
                </ul>
            </div>
        </div>
    );
}

