import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    Navbar,
    Container,
    Button,
    Nav
} from 'react-bootstrap';
import {
    navBarStyles,
    navBarBrand,
    spanIms,
} from '../../css/styles';

export default function NavigationBar() {
    const history = useHistory();

    const logOut = () => {
        localStorage.clear('jwt');
        history.push('/');
    };

    return (
        <Navbar fixed="top" expand="lg" style={navBarStyles}>
            <Container fluid>
                <Navbar.Brand href="/home" style={navBarBrand}>EXPERT CARE <span style={spanIms}>Inventory Management System Pharmacy</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                    </Nav>
                    <span style={{ color: 'white' }}>Welcome Staff! | <Button size="sm" variant="danger" onClick={logOut}>Log Out</Button></span>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};