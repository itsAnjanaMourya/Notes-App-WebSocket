import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { currentUser, isAuthenticated } = useAuth();

    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/" />;
    }

    if (adminOnly && currentUser.role !== 'admin') {
        return <Navigate to="/home" />;
    }

    return children;
};

export default PrivateRoute; 