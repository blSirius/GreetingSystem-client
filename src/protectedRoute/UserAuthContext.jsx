import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios';

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {

    // const [user, setUser] = useState('');
    let token = localStorage.getItem('token');
    let user = 'f';

    const decodedToken = async () => {

        try {
            const response = await axios.post('http://localhost:5000/decode-token', {
                token,
            });

            console.log('Login successful:', response.data.decoded.username);
            // setUser(response.data.decoded.username);
            user = response.data.decoded.username;
        }
        catch (error) {
            console.error('Error decoding token:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            // setUser('none')
        }
        else {
            decodedToken();
        };
    }, [])

    return (
        <UserAuthContext.Provider value={{ user }} >
            {children}
        </UserAuthContext.Provider>
    )
}

export function useUserAuth() {
    return useContext(UserAuthContext);
}