import React from 'react'
import NavBar from './nav/NavBar'
import { Container, InputGroup, Form, Button, Table } from 'react-bootstrap'
import AlbumCSS from './style/Album.module.css'


function Album() {
    return (
        <div>
            <NavBar />
            <Container>
                <div className={AlbumCSS.searchBar} >
                    <InputGroup size="md">
                        <Form.Control
                            aria-label="Large"
                            aria-describedby="inputGroup-sizing-sm"
                        />
                    </InputGroup>
                </div>

                <div className={AlbumCSS.newCollectionBtn} >
                    <Button href="/newCollection" variant='primary' >New Collection</Button>
                </div>

                <div className={AlbumCSS.table} >
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                                <th colSpan={2} ></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td style={{textAlign:'center'}} ><Button variant='success' style={{width:'80%'}} >View</Button></td>
                                <td style={{textAlign:'center'}} ><Button variant='danger' style={{width:'80%'}} >Dele</Button></td>
                            </tr>
                            <tr>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td style={{textAlign:'center'}} ><Button variant='success' style={{width:'80%'}} >View</Button></td>
                                <td style={{textAlign:'center'}} ><Button variant='danger' style={{width:'80%'}} >Dele</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>

            </Container>
        </div>
    )
}

export default Album