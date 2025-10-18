import React from 'react';
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth(); // Get user and logout function
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>
        Welcome, <strong>{currentUser.email}</strong>!
      </p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Dashboard;