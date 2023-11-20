import React, { useEffect, useState } from 'react';
import styles from './UserInvite.module.css'
import UserSearchCard from './UserSearchCard';
import {IoMdClose} from "react-icons/io";
import {v4 as uuidv4} from "uuid";
import { useUserSearchData } from '../../hooks/useUserSearchData';

export default function UserInvite({setInvitation,participants,handleInvitation}) {
    const [invitedUsers,setInvitedUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const {data: users, error} = useUserSearchData(searchTerm);

    function handleSearch(e) {
        const term = e.target.value;
        setSearchTerm(term);
    }

    const inviteUsers = () => {
        handleInvitation(invitedUsers);
        setInvitedUsers([]);
        setSearchTerm("");
        setSearchResults([]);
        setInvitation(false);
    }

    useEffect(() => {
        if (users && searchTerm !== "") {
            const valuesToFilter = participants.map((user)=>user.nickname);
            const combinedUsers = [...users.data,...participants];
            const filteredUsers = combinedUsers.filter((user)=>!valuesToFilter.includes(user.nickname))
            const filteredResults = filteredUsers.filter((user) =>
                user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
            setSelectedUser(null);
        }
    }, [users,searchTerm,participants]);

    return (
        <div className={styles.userInvitationContainer}>
            <div className={styles.InvitationBar}> 
                {invitedUsers.length > 0 ? invitedUsers.map((user)=>
                    <div key={user.id} className={styles.userTag}> 
                        {user.nickname}
                        <IoMdClose className={styles.closeIcon} onClick={()=>{setInvitedUsers(invitedUsers.filter((ele)=>ele.id !== user.id))}}/>
                    </div>) :
                    <div className={styles.defaultInvitedUsers}> 
                        Invited Users
                    </div>}
            </div>
            <div className={styles.searchContainer}>
                <input type="text"
                        placeholder="Type nickname"
                        value={searchTerm}
                        onChange={handleSearch}
                        className={styles.searchUsersBar}/>
                <ul className={styles.searchResultsContainer}>
                    <div className={styles.searchResultsTitle}>Search Results</div>
                    {error && <small className={styles.errorMsg} style={{paddingLeft:"0.5rem"}}>{error.message}</small>}
                    {searchResults && searchResults.map((user) => (
                        <UserSearchCard key={uuidv4()} 
                                            userID={user.id}
                                            imageURL={user.imageURL} 
                                            nickname={user.nickname}
                                            participants={invitedUsers}
                                            setParticipants={setInvitedUsers}
                                            selectedUser={selectedUser}/>
                    ))}
                </ul>
                <div className={styles.btnContainer}>
                    <button className={styles.cancelBtn} onClick={()=>{setInvitation(false)}}>Cancel</button>
                    <button className={styles.startBtn} 
                            onClick={inviteUsers}
                            disabled={invitedUsers.length > 0 ? false : true}>
                                Invite
                    </button>
                </div>
            </div>
        </div>

    );
}

