import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({children}) {
    const {user,isLoading} = useAuth();
    
    if(isLoading) return null;

    if(!user) {
        window.alert("You don't have authority to access the page!")
        return <Navigate to="/" replace />
    }

    return children;
}

