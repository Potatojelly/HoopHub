import React, { useState } from 'react';
import styles from './SearchBar.module.css'
import {FiSearch} from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import { usePostContext } from '../../context/PostContext';

export default function SearchBar() {
    const {setSelectedPage,setSelectedPostID} = usePostContext();
    const [searchTerm,setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
    }

    const submitKeyword = (e) => {
        e.preventDefault();
        setSelectedPage(null);
        setSelectedPostID(null);
        navigate(`/forums/search/${searchTerm}`,{state: {keyword: searchTerm}});
    }

    return (
        <form className={styles.searchBarContainer} onSubmit={submitKeyword}>
            <button className={styles.searchIconContainer}>
                <FiSearch className={styles.searchIcon}/>
            </button>
            <input
                type="text"
                placeholder="Search by Title"
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchBar}
                >
            </input>        
        </form>
    );
}

