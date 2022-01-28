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
    Table,
} from 'react-bootstrap';

import { homeContainer, navBarStyles, navBarBrand, spanIms, updateSaleStyleHeader } from '../../css/styles';

export default function AddNewSale() {
    const history = useHistory();

    useEffect(() => {
        // axios.get('/api/inv/getAllSales')
    });

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
                    <Col sm={5}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={updateSaleStyleHeader}>
                                            Update Sale 
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Row>
                                                <Form.Group as={Col} className="mb-3">
                                                    <Form.Label>Sale ID</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder=""
                                                        list="customerName"
                                                        // onChange={e => handleCustomerNameChange(e)}
                                                    />
                                                    {/* <datalist id="customerName">
                                                        {cxList.length >= 1 ? cxList.map((cx, index) => {
                                                            const { fullName } = cx;
                                                            return <option key={index} value={fullName} />
                                                        }): ''}
                                                    </datalist> */}
                                                </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Customer Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="customerName"
                                                            // onChange={e => handleCustomerNameChange(e)}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form id="updateSaleForm">
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Item Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list='itemName'
                                                            // onChange={e => handleItemNameChange(e)}
                                                        />
                                                        {/* <datalist id="itemName">
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                const { itemName } = prod;
                                                                return <option key={index} value={itemName} />
                                                            }): ''}
                                                        </datalist> */}
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Item Number</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            // value={itemDetails.itemNumber}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Quantity</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            // onChange={e => setItemDetails({ ...itemDetails, qty: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Discount %</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            // onChange={e => setItemDetails({ ...itemDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Unit Price</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            // value={itemDetails.unitPrice}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Total Stock</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            // value={itemDetails.stock}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Button
                                                type='submit'
                                                variant="primary"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                // onClick={handleAddToList}
                                            >
                                                Add Sale
                                            </Button>
                                            <Link to="/home"><Button size="sm" variant="outline-secondary">Cancel</Button></Link>
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