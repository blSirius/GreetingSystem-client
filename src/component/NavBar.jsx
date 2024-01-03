import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavBar() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Home</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Album</Nav.Link>
            <Nav.Link href="#features">Search</Nav.Link>

            <NavDropdown title="Editing" id="navbarScrollingDropdown">

              <NavDropdown.Item href="#action3">
                Add Person
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>

            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar; 