import React, { useEffect, useState } from 'react';
import styles from './UserSearch.module.css'

import {v4 as uuidv4} from "uuid";
import UserSearchCard from './UserSearchCard';
import {useNavigate,useLocation} from "react-router-dom";
import {useChatRoomID } from '../../context/ChatRoomContext';
import { useAddChatRoom } from '../../hooks/useChatRoomData';
import {IoMdClose} from "react-icons/io";
import { useSocket } from '../../context/SocketContext';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';

export default function UserSearch({searchService, chatService}) {
    const {state:chatRooms} = useLocation();
    const {user} = useAuth();
    const {nickname,imageURL} = useProfile();
    const [users,setUsers] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [chatName,setChatName] = useState("");
    const [participants,setParticipants] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [error,setError] = useState("");
    const [chatNameError,setChatNameError] = useState("");
    const [isFetched,setFetched] = useState(false);

    const [selectedUser,setSelectedUser] = useState(false);

    const {selectChatRoom,setSelectedChatRoom} = useChatRoomID();
    const {mutate} = useAddChatRoom();

    const {socket} = useSocket();

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

    const handleChatName = (e) => {
        setChatName(e.target.value);
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
        if(participants.length > 1 && chatName ==="") {
            setChatNameError("Please type chat name."); 
            setTimeout(() => {
                setChatNameError(null);
            }, 3000);
            return;
        }

        if(participants.length === 1) {
            const checkChatRoom = chatRooms.find((chatRoom)=>{
                if(chatRoom.isGroupChat) return;
                return chatRoom.users.find((user)=>user.nickname === participants[0].nickname)
            })
            if(checkChatRoom) {
                selectChatRoom(checkChatRoom.id);
                setSelectedChatRoom(checkChatRoom);
                navigate(`/messages/${participants[0].nickname}/${checkChatRoom.id}`);
                return;
            }
        }

        mutate({participants, chatName},{
            onSuccess: (result) => {
                console.log(participants);
                if(result.success === true) {
                    console.log(result);
                    selectChatRoom(result.chat.id);
                    setSelectedChatRoom(result.chat);
                    const text = participants.reduce((prev,cur,index)=>{
                        if(index===participants.length-1) return prev + `${cur.nickname}.`
                        return prev + `${cur.nickname}, `
                    },`${nickname} invited `)
                    const newChatRoom = {
                        chatName: result.chat.chatName,
                        groupAdmin: result.chat.groupAdmin,
                        isGroupChat: result.chat.isGroupChat,
                        createdAt: new Date(),
                        id: result.chat.id,
                        users: result.chat.users,
                        latestMessage: null,
                        unReadMessageCount:0, 
                        sender: {
                            id: user.id,
                            nickname,
                            imageURL,
                            system: true,
                        },
                        receiver: [...participants],
                    };

                    const invitationMessage = {
                        chat: { id: result.chat.id, users: result.chat.users },
                        image: false,
                        content: text,
                        createdAt: new Date(),
                        id: uuidv4(),
                        isInit: false,
                        sender: {
                            id: null,
                            nickname: null,
                            imageURL: null,
                            system: true,
                        }
                    }
                    navigate(`/messages/${result.chat.isGroupChat ? result.chat.chatName : participants[0].nickname}/${result.chat.id}`);
                    socket.emit("new chat room",newChatRoom);
                    socket.emit("invite", invitationMessage);
                }
            }
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                {participants.length > 1 && 
                <input type="text"
                        placeholder="Type chat name"
                        value={chatName}
                        onChange={handleChatName}
                        required={true}
                        className={styles.chatNameBar}/>}
                {chatNameError && <small className={styles.errorMsg}>{chatNameError}</small>}        
                <div className={styles.participantBar}> 
                    {participants.length > 0 ? participants.map((participant)=>
                        <div key={participant.id} className={styles.participantTag}> 
                            {participant.nickname}
                            <IoMdClose className={styles.closeIcon} onClick={()=>{setParticipants(participants.filter((ele)=>ele.id !== participant.id))}}/>
                        </div>) :
                    <div className={styles.defaultParticipant}> 
                        Participants
                    </div>}
                </div>
            </div>
            <div className={styles.searchContainer}>
                <input type="text"
                        placeholder="Type nickname"
                        value={searchTerm}
                        onChange={handleSearch}
                        className={styles.searchFriendsBar}/>
                <ul className={styles.searchResultsContainer}>
                    <div className={styles.searchResultsTitle}>Search Results</div>
                    {error && <small className={styles.errorMsg} style={{paddingLeft:"0.5rem"}}>{error.message}</small>}
                    {searchResults && searchResults.map((user) => (
                        <UserSearchCard key={uuidv4()} 
                                            userID={user.id}
                                            imageURL={user.imageURL} 
                                            nickname={user.nickname}
                                            chatName={chatName}
                                            setChatName={setChatName}
                                            participants={participants}
                                            setParticipants={setParticipants}
                                            selectedUser={selectedUser}
                                            setSelectedUser={setSelectedUser}/>
                    ))}
                </ul>
                <div className={styles.btnContainer}>
                    <button className={styles.cancelBtn} onClick={()=>{navigate("/messages")}}>Cancel</button>
                    <button className={styles.startBtn} 
                            onClick={()=>{startChat()}}
                            disabled={participants.length > 0 ? false : true}>
                                Start Chat
                    </button>
                </div>
            </div>
        </div>
    );
}

