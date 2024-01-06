// UserAuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
    const [user, setUser] = useState('');

    useEffect(() => {
        decodedToken();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.token);
            decodedToken();
        } catch (error) {
            console.error('Error during login:', error.response.data);
        }
    };

    const decodedToken = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.post('http://localhost:5000/decode-token', {
                    token,
                });
                setUser(response.data.decoded.username);
            } catch (error) {
                console.error('Error decoding token:', error.response ? error.response.data : error.message);
                localStorage.removeItem('token');
            }
        }
    };

    const logout = () => {
        setUser('');
        localStorage.removeItem('token');
    };

    const getCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.post('http://localhost:5000/decode-token', {
                    token,
                });
                const currentUser = response.data.decoded.username;
                return currentUser;
            } catch (error) {
                console.error('Error decoding token:', error.response ? error.response.data : error.message);
                localStorage.removeItem('token');
            }
        }
        return null;

    }

    return (
        <UserAuthContext.Provider value={{ user, login, logout, getCurrentUser }} >
            {children}
        </UserAuthContext.Provider>
    );
}

export const useUserAuth = () => {
    return useContext(UserAuthContext);
}