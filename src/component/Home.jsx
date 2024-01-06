import React from 'react'
import NavBar from './NavBar'
import { Container } from 'react-bootstrap'
import { useUserAuth } from '../protectedRoute/UserAuthContext';

function Home() {
    const auth = useUserAuth();

    return (
        <>
            <NavBar />
            <Container>
                {auth.user}
            </Container>
        </>
    )
}

export default Home