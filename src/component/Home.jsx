import React from 'react'
import NavBar from './nav/NavBar'
import { Container } from 'react-bootstrap'
import { useUserAuth } from '../context/UserAuthContext';

function Home() {
    const { user } = useUserAuth();

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