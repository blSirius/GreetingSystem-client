// ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from './UserAuthContext';

function ProtectedRoute({ children }) {
   
    const auth = useUserAuth();
    const location = useLocation();

    // console.log('currentUser : ', auth.getCurrentUser());

    const currentUser = auth.getCurrentUser();

    if (!currentUser) {
        return <Navigate to="/login" state={{ path: location.pathname }} />;
    }

    return children;
}

export default ProtectedRoute;