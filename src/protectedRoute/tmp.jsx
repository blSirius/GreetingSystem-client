import React from 'react'

// add react-router-dom
import { Navigate } from 'react-router-dom'

// add useUserAuth
import { useUserAuth } from '../context/UserAuthContext'

function ProtectedRoute({ children }) {
  const { user } = useUserAuth();
  if (!user) {
    return <Navigate to="/" />
  }
  return children;
}
export default ProtectedRoute