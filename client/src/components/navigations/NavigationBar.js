import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import getJwt from '../../helper/getJwt';
import axios from 'axios';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import {
    Navbar,
    Container,
    Nav,
    Dropdown,
} from 'react-bootstrap';
import {
    BsPersonCircle,
    BsBoxArrowRight,
} from 'react-icons/bs';
import {
    navBarStyles,
    navBarBrand,
    spanIms,
} from '../../css/styles';

export default function NavigationBar() {
    const history = useHistory();
    const [userDetails, setUserDetails] = useState({ fullName: 'Guest Account' });

    useEffect(() => {
        axios.get('/api/user/getUserDetailsByUsername',
            { params: { username: localStorage.getItem('username') },
            headers: { Authorization: getJwt() }  })
            .then(res => {
                const { fullName } = res.data.message;

                if (fullName.split(' ').length < 2) {
                    setUserDetails({ fullName: fullName + ' Account' });
                } else {
                    setUserDetails({ fullName: res.data.message.fullName });
                };

            })
            .catch()
    }, []);

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            style={{
                color: 'white',
                textDecoration: 'none',
                marginLeft: '5px',
                marginRight: '30px'
            }}
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
            {' '}&#x25bc;
        </a>
    ));

    function stringToColor(string) {
        let hash = 0;
        let i;
      
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        };
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        };
      
        return color;
    };
      
    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    };

    const logOut = () => {
        localStorage.clear('jwt');
        history.push('/');
    };

    return (
        <Navbar fixed="top" expand="lg" style={navBarStyles}>
            <Container fluid>
                <Navbar.Brand href="/home" style={navBarBrand}>EXPERT CARE <span style={spanIms}>Pharmacy Inventory Management System</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                    </Nav>
                    <Stack direction="row">
                        <Avatar
                            {...stringAvatar(userDetails.fullName)}
                        />
                    </Stack>
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                            {userDetails.fullName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ fontSize: '14px' }}>
                            <Dropdown.Item
                                eventKey="1"
                                disabled
                            >
                                    <BsPersonCircle size='20' /> My Account
                                </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                eventKey="2"
                                onClick={logOut}
                            >
                                <BsBoxArrowRight size='20' /> Log Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};