import React from 'react';
import { Nav } from 'react-bootstrap';

export default function SideBar() {
    return (
        <Nav variant="pills" className="flex-column">
            <Nav.Item style={{ cursor: 'pointer' }}>
                <Nav.Link eventKey="first" style={{ backgroundColor: '#2f91b4' }}>Inventory</Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ cursor: 'not-allowed' }}>
                <Nav.Link eventKey="second" disabled>Services</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};