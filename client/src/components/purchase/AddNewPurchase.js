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

import {
    homeContainer,
    navBarStyles,
    navBarBrand,
    spanIms,
    cardStyleHeader
} from '../../css/styles';

export default function AddNewProduct() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [purDetails, setPurDetails] = useState({});
    const [prodList, setProdList] = useState([]);
    const [vendList, setVendList] = useState([]);

    useEffect(() => {
        axios.get('/api/inv/getAllProducts',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let prodArr = [];
                res.data.message.map(prod => {
                    prodArr.push({
                        prodId: prod.productID,
                        itemNumber: prod.itemNumber,
                        itemName: prod.itemName,
                        discount: prod.discount,
                        stock: prod.stock,
                        unitPrice: prod.unitPrice,
                        desc: prod.description
                    });
                });
    
                return setProdList(prodArr);

            }).catch(error => setProdList({ key: error.name, text: error.message }));

        axios.get('/api/inv/getAllVendors',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let vendArr = [];
                res.data.message.map(vendor => {
                    vendArr.push({ vendorId: vendor.vendorID, vendorName: vendor.fullName });
                });
    
                return setVendList(vendArr);

            }).catch(error => setVendList({ key: error.name, text: error.message }));
    }, []);

    const addNewPurchase = () => {
        const {
            itemName,
            itemNumber,
            quantity,
            unitPrice,
            vendorName,
            purchaseDate
        } = purDetails;

        if (itemName !== undefined && itemNumber !== undefined && quantity !== undefined && unitPrice !== undefined && vendorName !== undefined && purchaseDate !== undefined) {
            if (itemName !== "" && itemNumber !== "" && quantity !== "" && unitPrice !== "" && vendorName !== "" && purchaseDate !== "") {
                axios.post('/api/inv/addNewPurchase', purDetails,
                    { headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Purchase Added!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))
            } else {
                setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
            };
        } else {
            setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
        };

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleItemNameChange = (e) => {
        setPurDetails({ ...purDetails, itemName: e.target.value });
        prodList.find(x => {
            if (x.itemName === e.target.value) {
                setPurDetails({ ...purDetails, itemName: x.itemName, itemNumber: x.itemNumber });
            };
        });

        if (e.target.value === "") {
            setPurDetails({
                itemName: "",
                itemNumber: "",
                quantity: "",
                unitPrice: "",
                vendorName: "",
                purchaseDate: ""
            });
        };
    };

    const handleVendorNameChange = (e) => {
        setPurDetails({ ...purDetails, vendorName: e.target.value });
        vendList.find(x => {
            if (x.vendorName === e.target.value) {
                setPurDetails({ ...purDetails, vendorName: x.vendorName, vendorId: x.vendorId });
            };
        });
    };

    const resetForm = () => {
        document.getElementById("addNewPurForm").reset();
        setPurDetails({
            itemName: '',
            itemNumber: '',
            quantity: '',
            unitPrice: '',
            vendorName: '',
            purchaseDate: ''
        });
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
                                            Add New Purchase
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="addNewPurForm">
                                                <Alert variant={notif.variant} show={notif.status} onClose={() => setNotif({ status: false })} dismissible>{notif.message}</Alert>
                                                <Row>
                                                    <Form.Group as={Col} sm={7} className="mb-3">
                                                        <Form.Label>Item Name<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Item Name"
                                                            list="itemName"
                                                            value={purDetails.itemName}
                                                            onChange={e => handleItemNameChange(e)}
                                                        />
                                                        <datalist id="itemName">
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                return <option key={index} value={prod.itemName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Item Number<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={purDetails.itemNumber}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Quantity<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Enter Quantity"
                                                            min={0}
                                                            value={purDetails.quantity}
                                                            onChange={e => setPurDetails({ ...purDetails, quantity: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label>Unit Price<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Enter Unit Price"
                                                            min={0}
                                                            value={purDetails.unitPrice}
                                                            onChange={e => setPurDetails({ ...purDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={7} className="mb-3">
                                                        <Form.Label>Vendor Name<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Vendor Name"
                                                            list="vendorName"
                                                            min={0}
                                                            value={purDetails.vendorName}
                                                            onChange={e => handleVendorNameChange(e)}
                                                        />
                                                        <datalist id="vendorName">
                                                            {vendList.length >= 1 ? vendList.map((vendor, index) => {
                                                                return <option key={index} value={vendor.vendorName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={5} className="mb-3">
                                                        <Form.Label>Purchase Date<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            placeholder="Enter Purchase Date"
                                                            value={purDetails.purchaseDate}
                                                            onChange={e => setPurDetails({ ...purDetails, purchaseDate: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Button
                                                type='submit'
                                                variant="primary"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={addNewPurchase}
                                            >
                                                Add Purchase
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