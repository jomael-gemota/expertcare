import React, { useState } from 'react';
import { Tab, Nav, Row, Col, CardGroup, Card, Container, Navbar, Tabs, Button, Table, FormGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { homeContainer, navBarStyles, navBarBrand, spanIms, invCardHeader, saleFormGroup } from '../css/styles';

export default function Home() {
    const history = useHistory();

    const logOut = () => {
        localStorage.clear('jwt');
        history.push('/');
    };

    return (
        <div style={homeContainer}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col>
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
                    </Col>
                </Row>
                <br />
                <br />
                <Row style={{ padding: '3%' }}>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Inventory</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second" disabled>Services</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                            <CardGroup>
                                <Card>
                                    <Card.Header style={invCardHeader}>
                                        Manage Inventory
                                        <Button size="sm" variant="info" style={{ float: 'right' }}>Refresh</Button>
                                    </Card.Header>
                                    <Card.Body>
                                        <Tabs defaultActiveKey="sales" id="uncontrolled-tab-example" className="mb-3">
                                            <Tab eventKey="sales" title="Sales">
                                                <h3>Sales Inventory</h3>
                                                <p>This is where you can see all of the products that got ordered for every customer.</p>
                                                <FormGroup style={saleFormGroup}>
                                                    <Button size="sm" variant="success" style={{ marginRight: '5px' }}>New Sale</Button>
                                                    <Button size="sm" variant="warning" style={{ marginRight: '5px' }}>Update a Sale</Button>
                                                    <Button size="sm" variant="outline-danger">Remove a Sale</Button>
                                                    <DropdownButton size="sm" id="dropdown-basic-button" title="Export Reports" style={{ float: 'right' }}>
                                                        <Dropdown.Item href="#/action-1">Copy to Cliboard</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">CSV</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Excel</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">PDF</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Print</Dropdown.Item>
                                                    </DropdownButton>
                                                </FormGroup>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                        <th>#</th>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Username</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                        <td>1</td>
                                                        <td>Mark</td>
                                                        <td>Otto</td>
                                                        <td>@mdo</td>
                                                        </tr>
                                                        <tr>
                                                        <td>2</td>
                                                        <td>Jacob</td>
                                                        <td>Thornton</td>
                                                        <td>@fat</td>
                                                        </tr>
                                                        <tr>
                                                        <td>3</td>
                                                        <td colSpan={2}>Larry the Bird</td>
                                                        <td>@twitter</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Tab>
                                            <Tab eventKey="products" title="Products">
                                                <p>Products</p>
                                            </Tab>
                                            <Tab eventKey="purchase" title="Purchase">
                                                <p>Purchase</p>
                                            </Tab>
                                            <Tab eventKey="vendor" title="Vendor">
                                                <p>Vendor</p>
                                            </Tab>
                                            <Tab eventKey="customer-database" title="Customer Database">
                                                <p>Customer Database</p>
                                            </Tab>
                                        </Tabs>
                                    </Card.Body>
                                </Card>
                            </CardGroup>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <p>This page is not yet approved for display.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
};