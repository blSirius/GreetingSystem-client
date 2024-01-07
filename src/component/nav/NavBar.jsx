import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

function NavBar() {
  const { logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    logout();
    navigate('/');
  }
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>

          {/* brand */}
          <Navbar.Brand href="/home">Home</Navbar.Brand>

          <Nav className="me-auto">

            {/* menu */}
            <Nav.Link href="/album">Album</Nav.Link>

            {/* dropdown */}
            <NavDropdown title="dropdown" id="navbarScrollingDropdown">

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

            <Button variant='danger' onClick={handleLogOut} >Log out</Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar; 