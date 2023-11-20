import React from 'react';
import { useAuth } from '../context/AuthContext';
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({children}) {
    const {user,isLoading} = useAuth();

    if(isLoading) return null;

    if(!user) {
        return <Navigate to="/" replace />
    }

    return children;
}

