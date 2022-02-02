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

import {
    homeContainer,
    navBarStyles,
    navBarBrand,
    spanIms,
    invCardHeader,
    formGroup
} from '../css/styles';

export default function Home() {
    const history = useHistory();
    const [saleList, setSaleList] = useState([]);
    const [prodList, setProdList] = useState([]);
    const [purList, setPurList] = useState([]);
    const [vendList, setVendList] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);

    window.alert = function () {};
    
    useEffect(() => {
        axios.get('/api/inv/getAllSales',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let saleArr = []
                res.data.message.map(item => {
                    saleArr.push({
                        saleId: item.saleID,
                        itemNumber: item.itemNumber,
                        customerId: item.customerID,
                        customerName: item.customerName,
                        itemName: item.itemName,
                        saleDate: item.saleDate,
                        discount: item.discount,
                        qty: item.quantity,
                        unitPrice: item.unitPrice
                    });
                });

                $(document).ready( function () {
                    $('#saleTable').DataTable({
                        order: [[ 0, "desc" ]],
                        "columnDefs": [
                            {"className": "dt-center", "targets": [0, 1, 4, 5, 6, 7]}
                        ]
                    });
                });

                return setSaleList(saleArr);

            }).catch(error => setSaleList({ key: error.name, text: error.message }));

            axios.get('/api/inv/getAllProducts',
                { headers: { Authorization: getJwt() } })
                .then(res => {
                    let prodArr = [];
                    res.data.message.map(prod => {
                        prodArr.push({
                            productId: prod.productID,
                            itemNumber: prod.itemNumber,
                            itemName: prod.itemName,
                            units: prod.units,
                            discount: prod.discount,
                            stock: prod.stock,
                            unitPrice: prod.unitPrice,
                            image: prod.imageURL,
                            status: prod.status,
                            description: prod.description
                        });
                    });

                    $(document).ready( function () {
                        $('#prodTable').DataTable({
                            order: [[ 1, "asc" ]],
                            "columnDefs": [
                                {"className": "dt-center", "targets": [3, 4, 5]}
                            ]
                        });
                    });

                    return setProdList(prodArr);

                }).catch(error => setProdList({ key: error.name, text: error.message }));

            axios.get('/api/inv/getAllPurchase',
                { headers: { Authorization: getJwt() } })
                .then(res => {
                    let purArr = [];
                    res.data.message.map(pur => {
                        purArr.push({
                            purchaseId: pur.purchaseID,
                            itemName: pur.itemName,
                            itemNumber: pur.itemNumber,
                            quantity: pur.quantity,
                            unitPrice: pur.unitPrice,
                            vendorName: pur.vendorName,
                            vendorId: pur.vendorID,
                            purchaseDate: pur.purchaseDate
                        });
                    });

                    $(document).ready( function () {
                        $('#purTable').DataTable({
                            order: [[ 1, "asc" ]],
                            "columnDefs": [
                                {"className": "dt-center", "targets": [0, 3, 4, 6]}
                            ]
                        });
                    });

                    return setPurList(purArr);

                }).catch(error => setPurList({ key: error.name, text: error.message }));

            axios.get('/api/inv/getAllVendors',
                { headers: { Authorization: getJwt() } })
                .then(res => {
                    let vendArr = [];
                    res.data.message.map(vend => {
                        vendArr.push({
                            vendorId: vend.vendorID,
                            fullName: vend.fullName,
                            email: vend.email,
                            mobile: vend.mobile,
                            phone: vend.phone2,
                            address: vend.address,
                            city: vend.city,
                            district: vend.district
                        });
                    });

                    $(document).ready( function () {
                        $('#vendTable').DataTable({
                            order: [[ 1, "asc" ]],
                            "columnDefs": [
                                {"className": "dt-center", "targets": [0, 3, 4, 6]}
                            ]
                        });
                    });

                    return setVendList(vendArr);

                }).catch(error => setVendList({ key: error.name, text: error.message }));
                
    }, [isUpdate]);

    const refresh = () => {
        setIsUpdate(!isUpdate)
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
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={invCardHeader}>
                                            Manage Inventory
                                            <Button size="sm" variant="info" style={{ float: 'right' }} onClick={refresh}>Refresh</Button>
                                        </Card.Header>
                                        <Card.Body>
                                            <Tabs defaultActiveKey="sales" id="uncontrolled-tab-example" className="mb-3">
                                                <Tab eventKey="sales" title="Sales">
                                                    <h3>Sales Inventory</h3>
                                                    <p>This is where you can see all of the sales that are being added per customer.</p>
                                                    <FormGroup style={formGroup}>
                                                        <Link to='/home/add-new-sale'><Button size="sm" variant="success" style={{ marginRight: '5px' }}>Add New Sale</Button></Link>
                                                        <Link to='/home/update-sale'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}>Edit Sale</Button></Link>
                                                        <Link to='/home/remove-sale'><Button size="sm" variant="outline-danger" style={{ marginRight: '5px' }}>Remove Sale</Button></Link>
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
                                                                <th>Total Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {saleList.length >= 1 ? saleList.map((sale, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{sale.saleId}</td>
                                                                    <td>{moment(sale.saleDate).format('MM/DD/YYYY')}</td>
                                                                    <td>{sale.customerName}</td>
                                                                    <td>{sale.itemName}</td>
                                                                    <td>{sale.discount === 0 ? '' : sale.discount + '%'}</td>
                                                                    <td>{sale.qty}</td>
                                                                    <td>{'₱ ' + sale.unitPrice}</td>
                                                                    <td>{'₱ ' + sale.qty * sale.unitPrice}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                                <Tab eventKey="products" title="Products">
                                                    <h3>Products Inventory</h3>
                                                    <p>This is where you can manage all the inventory of your products.</p>
                                                    <FormGroup style={formGroup}>
                                                        <Link to='/home/add-new-product'><Button size="sm" variant="success" style={{ marginRight: '5px' }}>Add New Product</Button></Link>
                                                        <Link to='/home/update-product'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}>Edit Product</Button></Link>
                                                        <Link to='/home/remove-product'><Button size="sm" variant="outline-danger">Remove Product</Button></Link>
                                                        <DropdownButton size="sm" id="dropdown-basic-button" title="Export Reports" style={{ float: 'right' }}>
                                                            <Dropdown.Item href="#/action-1">Copy to Cliboard</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">CSV</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Excel</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">PDF</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Print</Dropdown.Item>
                                                        </DropdownButton>
                                                    </FormGroup>
                                                    <Table striped bordered hover size='sm' id='prodTable'>
                                                        <thead>
                                                            <tr>
                                                                <th>Item No.</th>
                                                                <th>Item Name</th>
                                                                <th>Units</th>
                                                                <th>Unit Price</th>
                                                                <th>Stock</th>
                                                                <th>Discount</th>
                                                                <th>Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{prod.itemNumber}</td>
                                                                    <td>{prod.itemName}</td>
                                                                    <td>{prod.units}</td>
                                                                    <td>{'₱ ' + prod.unitPrice}</td>
                                                                    <td>{prod.stock}</td>
                                                                    <td>{prod.discount === 0 ? '' : prod.discount + '%'}</td>
                                                                    <td>{prod.description}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                                <Tab eventKey="purchase" title="Purchase">
                                                    <h3>Purchasing Inventory</h3>
                                                    <p>This is where you can manage all of your purchases.</p>
                                                    <FormGroup style={formGroup}>
                                                        <Link to='/home/add-new-purchase'><Button size="sm" variant="success" style={{ marginRight: '5px' }}>Add New Purchase</Button></Link>
                                                        <Link to='/home/update-purchase'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}>Edit Purchase</Button></Link>
                                                        <Link to='/home/remove-purchase'><Button size="sm" variant="outline-danger">Remove Purchase</Button></Link>
                                                        <DropdownButton size="sm" id="dropdown-basic-button" title="Export Reports" style={{ float: 'right' }}>
                                                            <Dropdown.Item href="#/action-1">Copy to Cliboard</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">CSV</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Excel</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">PDF</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Print</Dropdown.Item>
                                                        </DropdownButton>
                                                    </FormGroup>
                                                    <Table striped bordered hover size='sm' id='purTable'>
                                                        <thead>
                                                            <tr>
                                                                <th>Purchase ID</th>
                                                                <th>Item No.</th>
                                                                <th>Item Name</th>
                                                                <th>Qty</th>
                                                                <th>Unit Price</th>
                                                                <th>Vendor Name</th>
                                                                <th>Purchase Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {purList.length >= 1 ? purList.map((pur, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{pur.purchaseId}</td>
                                                                    <td>{pur.itemNumber}</td>
                                                                    <td>{pur.itemName}</td>
                                                                    <td>{pur.quantity}</td>
                                                                    <td>{'₱ ' + pur.unitPrice}</td>
                                                                    <td>{pur.vendorName}</td>
                                                                    <td>{moment(pur.purchaseDate).format('MM/DD/YYYY')}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                                <Tab eventKey="vendors" title="Vendors">
                                                    <h3>Vendors Inventory</h3>
                                                    <p>This is where you can manage all of your available vendors.</p>
                                                    <FormGroup style={formGroup}>
                                                        <Link to='/home/add-new-vendor'><Button size="sm" variant="success" style={{ marginRight: '5px' }}>Add New Vendor</Button></Link>
                                                        <Link to='/home/update-vendor'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}>Edit Vendor</Button></Link>
                                                        <Link to='/home/remove-vendor'><Button size="sm" variant="outline-danger">Remove Vendor</Button></Link>
                                                        <DropdownButton size="sm" id="dropdown-basic-button" title="Export Reports" style={{ float: 'right' }}>
                                                            <Dropdown.Item href="#/action-1">Copy to Cliboard</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">CSV</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Excel</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">PDF</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">Print</Dropdown.Item>
                                                        </DropdownButton>
                                                    </FormGroup>
                                                    <Table striped bordered hover size='sm' id='vendTable'>
                                                        <thead>
                                                        {/* vendorId: vend.vendorID,
                                                        fullName: vend.fullName,
                                                        email: vend.email,
                                                        mobile: vend.mobile,
                                                        phone: vend.phone2,
                                                        address: vend.address,
                                                        city: vend.city,
                                                        district: vend.district */}
                                                            <tr>
                                                                <th>Vendor ID</th>
                                                                <th>Full Name</th>
                                                                <th>Email Address</th>
                                                                <th>Mobile #</th>
                                                                <th>Phone #</th>
                                                                <th>Address</th>
                                                                <th>City</th>
                                                                <th>District</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {vendList.length >= 1 ? vendList.map((vend, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{vend.vendorId}</td>
                                                                    <td>{vend.fullName}</td>
                                                                    <td>{vend.email}</td>
                                                                    <td>{vend.mobile}</td>
                                                                    <td>{vend.phone}</td>
                                                                    <td>{vend.address}</td>
                                                                    <td>{vend.city}</td>
                                                                    <td>{vend.district}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
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