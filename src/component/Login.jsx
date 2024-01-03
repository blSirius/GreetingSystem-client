import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            console.error('Error during login:', error.response.data);
        }
    };

    return (
        <>
            <Container>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Login</button>
                </form>
            </Container>
        </>
    );
}
export default Login;