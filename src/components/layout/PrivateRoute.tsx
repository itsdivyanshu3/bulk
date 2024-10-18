import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute: React.FC = () => {
    // Check if the user is authenticated by looking for 'authToken' in localStorage
    const isAuthenticated = !!localStorage.getItem('authToken');

    // If the user is authenticated, render the requested page, otherwise redirect to login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
