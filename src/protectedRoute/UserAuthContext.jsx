// UserAuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState('');

  const getCurrentUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      const response = await axios.post('http://localhost:5000/decode-token', { token });
      const currentUser = response.data.decoded.username;
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      handleTokenError(error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      console.log('Login state');
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Error during login:', error.response.data);
    }
  };

  const logout = () => {
    setUser('');
    localStorage.removeItem('token');
  };

  const handleTokenError = (error) => {
    console.error('Error decoding token:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    throw error;
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout, getCurrentUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(UserAuthContext);
};