import React, { useState } from 'react';
import styles from './People.module.css'
import FriendSearchResultCard from '../components/Friend/FriendSearchResultCard';

export default function People() {
    const allFriends = [
        { id: 1, nickname: 'John Doe', imageURL:"",  friendship: false},
        { id: 2, nickname: 'Jane Smith' , imageURL:"",  friendship:true},
        { id: 3, nickname: 'Alice Johnson' ,imageURL:"",  friendship:false},
      ];
    
      const [searchTerm, setSearchTerm] = useState('');
      const [searchResults, setSearchResults] = useState([]);

      const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if(term !== "") {
            const filteredResults = allFriends.filter((friend) =>
            friend.nickname.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filteredResults);
        }
        else setSearchResults("");
        }
    
    
      return (
        <div className={styles.searchFriendsContainer}>
            <div className={styles.searchFriendsSubContainer}>
                <h1 className={styles.title}>Search Friends</h1>
                <input
                type="text"
                placeholder="Type nickname"
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchFriendsBar}
                />
                <ul className={styles.searchResultsContainer}>
                    <div className={styles.searchResultsTitle}>Search Results</div>
                    {searchResults && searchResults.map((friend) => (
                        <FriendSearchResultCard key={friend.id} imageURL={friend.imageURL} nickname={friend.nickname} friendship={friend.friendship}/>
                    ))}
                </ul>
            </div>
        </div>
      );
}

