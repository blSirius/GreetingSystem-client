import React from 'react'
import NavBar from './NavBar'
import { Container } from 'react-bootstrap'
import { useUserAuth } from '../protectedRoute/UserAuthContext';

function Home() {
    const {user} = useUserAuth();

    return (
        <>
            <NavBar />
            <Container>
                {user}
            </Container>
        </>
    )
}

export default Home