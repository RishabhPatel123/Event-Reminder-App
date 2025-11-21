import React from 'react';
import { useAuth } from './context/authContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If a user is logged in, show the component they asked for
  return children;
};

export default ProtectedRoute;