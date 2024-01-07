import React from 'react'
import NavBar from './NavBar'
import { Container } from 'react-bootstrap'
import { useUserAuth } from '../protectedRoute/UserAuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { user, logout } = useUserAuth();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        logout();
        navigate('/');
    }

    return (
        <>
            <NavBar />
            <Container>
                {user}
                <button type="button" onClick={handleLogOut} >Log out</button>
            </Container>
        </>
    )
}

export default Home