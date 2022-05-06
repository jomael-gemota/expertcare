import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';


import { MdOutlineInventory2, MdOutlineMedicalServices } from 'react-icons/md';

import '../../css/sidebar.css';

export default function SideBar() {
    return (
        <div className="sidebar">
            <h4>Expert Care</h4>
            <hr />
            <Nav className="flex-column">
                <span className='main-menu-title'>Main Menu</span>
                <div style={{ border: '0px solid blue', padding: '0px 10px 10px 10px' }}>
                    <Nav.Item className='nav-item'>
                        <Nav.Link href='/home' eventKey="first"><MdOutlineInventory2 size={30} color="#F1C40F" className='sidebar-icons' /> Inventory</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className='nav-item'>
                        <Nav.Link
                            eventKey="second"
                        >
                            <MdOutlineMedicalServices size={30} color="#F1C40F" className='sidebar-icons' /> Services
                        </Nav.Link>
                    </Nav.Item>
                </div>
            </Nav>
        </div>
    );
};