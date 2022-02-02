import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import getJwt from '../../helper/getJwt';
import {
    Card,
    CardGroup,
    Form,
    Button,
    Tab,
    Row,
    Col,
    Nav,
    Navbar,
    Container,
    Alert,
} from 'react-bootstrap';

import { homeContainer, navBarStyles, navBarBrand, spanIms, cardStyleHeader } from '../../css/styles';

export default function AddNewProduct() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [prodDetails, setProdDetails] = useState({});

    const addNewProduct = () => {
        const { itemName, itemNumber, units, unitPrice, stock } = prodDetails;
        if (prodDetails.discount === undefined) {
            prodDetails.discount = 0
        };
        if (prodDetails.description === undefined) prodDetails.description = "";

        if (itemName !== undefined && itemNumber !== undefined && units !== undefined && unitPrice !== undefined && stock !== undefined) {
            axios.post('/api/inv/addNewProduct', prodDetails,
                { headers: { Authorization: getJwt() } })
                .then(() => {
                    setNotif({ status: true, variant: 'success', message: 'Product Added!' });
                    resetForm();
                })
                .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))
        } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' })

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const resetForm = () => {
        document.getElementById("addNewProdForm").reset();
        setProdDetails({ itemName: '', itemNumber: '', units: '', unitPrice: '', stock: '', discount: '', description: '' });
    };
    
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
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Inventory</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second" disabled>Services</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={6}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={cardStyleHeader}>
                                            Add New Product 
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="addNewProdForm">
                                                <Alert variant={notif.variant} show={notif.status} onClose={() => setNotif({ status: false })} dismissible>{notif.message}</Alert>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Item Name<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Item Name"
                                                            value={prodDetails.itemName}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemName: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Item Number<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Item Number"
                                                            value={prodDetails.itemNumber}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemNumber: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Units<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Units"
                                                            value={prodDetails.units}
                                                            onChange={e => setProdDetails({ ...prodDetails, units: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Unit Price<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Enter Unit Price"
                                                            value={prodDetails.unitPrice}
                                                            onChange={e => setProdDetails({ ...prodDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Stock<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Enter Stock"
                                                            min={0}
                                                            value={prodDetails.stock}
                                                            onChange={e => setProdDetails({ ...prodDetails, stock: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Discount %</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Enter Discount"
                                                            min={0}
                                                            value={prodDetails.discount}
                                                            onChange={e => setProdDetails({ ...prodDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={5}
                                                            type="text"
                                                            placeholder="Enter Description..."
                                                            value={prodDetails.description}
                                                            onChange={e => setProdDetails({ ...prodDetails, description: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Button
                                                type='submit'
                                                variant="primary"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={addNewProduct}
                                            >
                                                Add Product
                                            </Button>
                                            <Link to="/home"><Button size="sm" variant="outline-secondary">Go Back</Button></Link>
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
    )
};