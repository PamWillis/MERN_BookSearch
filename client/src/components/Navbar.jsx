import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from '../pages/SignupForm';
import LoginForm from '../pages/LoginForm';

import AuthService from '../utils/auth';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLoginSignupClick = () => {
    setShowModal(true);
  }
  const handleLogout = () => {
    // Use the logout function from AuthService
    AuthService.logout();
  }
  return (
    <>
      <BootstrapNavbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <BootstrapNavbar.Brand as={Link} to='/'>
            Google Books Search
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls='navbar' />
          <BootstrapNavbar.Collapse id='navbar' className='justify-content-end'>
            <Nav>
              <Nav.Link as={Link} to='/'>
                Search For Books
              </Nav.Link>
              {AuthService.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/savedBooks'>
                    See Your Books
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={handleLoginSignupClick}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;