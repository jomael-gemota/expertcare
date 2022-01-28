import React, { useState, useEffect } from 'react';
import {
    Tab,
    Nav,
    Row,
    Col,
    CardGroup,
    Card,
    Container,
    Navbar,
    Tabs,
    Button,
    Table,
    FormGroup,
    Dropdown,
    DropdownButton,
} from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import getJwt from '../helper/getJwt';
import $ from 'jquery';
import dt from 'datatables.net';
import moment from 'moment';

import { homeContainer, navBarStyles, navBarBrand, spanIms, invCardHeader, saleFormGroup } from '../css/styles';

export default function Home() {
    const history = useHistory();
    const [saleList, setSaleList] = useState([]);
    
    useEffect(() => {
        axios.get('/api/inv/getAllSales',
        { headers: { Authorization: getJwt() } })
        .then(res => {
            let saleArr = []
            res.data.message.map((item, index) => {
                const { saleID, itemNumber, customerID, customerName, itemName, saleDate, discount, quantity, unitPrice } = item;
                saleArr.push({ key: index, saleId: saleID, itemNumber: itemNumber, customerId: customerID, customerName: customerName, itemName: itemName, saleDate: saleDate, discount: discount, qty: quantity, unitPrice: unitPrice });
            });

            $(document).ready( function () {
                $('#saleTable').DataTable({
                    scrollY: 250,
                    order: [[ 0, "desc" ]],
                });
            });

            return setSaleList(saleArr);
        }).catch(error => setSaleList({ key: error.name, text: error.message }));
    }, []);

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
                    <Col sm={10}>
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
                                                        <Link to='/home/add-new-sale'><Button size="sm" variant="success" style={{ marginRight: '5px' }}>New Sale</Button></Link>
                                                        <Link to='/home/update-sale'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}>Update a Sale</Button></Link>
                                                        <Button size="sm" variant="outline-danger">Remove a Sale</Button>
                                                        <DropdownButton size="sm" id="dropdown-basic-button" title="Export Reports" style={{ float: 'right' }}>
                                                            <Dropdown.Item href="#/action-1">Copy to Cliboard</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">CSV</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Excel</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">PDF</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Print</Dropdown.Item>
                                                        </DropdownButton>
                                                    </FormGroup>
                                                    <Table striped bordered hover size='sm' id='saleTable'>
                                                        <thead>
                                                            <tr>
                                                                <th>Sale ID</th>
                                                                <th>Sale Date</th>
                                                                <th>Customer Name</th>
                                                                <th>Item Name</th>
                                                                <th>Discount</th>
                                                                <th>Qty</th>
                                                                <th>Unit Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {saleList.length >= 1 ? saleList.map((item, index) => {
                                                                const { saleId, customerName, itemName, saleDate, discount, qty, unitPrice } = item;
                                                                return <tr key={index} style={{ fontSize: '14px', lineHeight: '10px' }}>
                                                                    <td>{saleId}</td>
                                                                    <td>{moment(saleDate).format('MM/DD/YYYY')}</td>
                                                                    <td>{customerName}</td>
                                                                    <td>{itemName}</td>
                                                                    <td>{discount === 0 ? '' : discount}</td>
                                                                    <td>{qty}</td>
                                                                    <td>{unitPrice}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td>""</td>
                                                                    <td>""</td>
                                                                    <td>""</td>
                                                                    <td>""</td>
                                                                    <td>""</td>
                                                                    <td>""</td>
                                                                    <td>""</td>
                                                                    <td>""</td>
                                                                    <td>""</td>
                                                                </tr>}
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