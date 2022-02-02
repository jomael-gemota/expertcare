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
    Modal,
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
    const [purList, setPurList] = useState([]);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
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
                        vendorId: pur.vendorID,
                        vendorName: pur.vendorName,
                        purchaseDate: pur.purchaseDate
                    });
                });
    
                return setPurList(purArr);

            }).catch(error => setPurList({ key: error.name, text: error.message }));
    }, [purDetails.purchaseId]);

    const deletePurchaseById = () => {
        if (purDetails.purchaseId !== undefined) {
            if (purDetails.purchaseId !== "") {
                handleModalClose();

                axios.delete('/api/inv/deletePurchaseById',
                    { params: { id: purDetails.purchaseId },
                    headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Purchase Deleted!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))

                setTimeout(function() {
                    setNotif({ ...notif, status: false });
                }, 3000);
            };
        };
    };

    const handleDeleteConfirmation = () => {
        if (purDetails.purchaseId !== undefined) {
            if (purDetails.purchaseId !== "") {
                setModalShow(true);
            } else {
                setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
            };
        } else {
            setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
        };
    };

    const handlePurchaseIDChange = (e) => {
        setPurDetails({ ...purDetails, purchaseId: e.target.value });
        purList.find(x => {
            if (x.purchaseId === Number(e.target.value)) {
                setPurDetails({
                    purchaseId: x.purchaseId,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    quantity: x.quantity,
                    unitPrice: x.unitPrice,
                    vendorId: x.vendorId,
                    vendorName: x.vendorName,
                    purchaseDate: moment(x.purchaseDate).format('YYYY-MM-DD')
                });
            };

            if (e.target.value === "") {
                setPurDetails({
                    itemName: '',
                    itemNumber: '',
                    quantity: '',
                    unitPrice: '',
                    vendorId: '',
                    vendorName: '',
                    purchaseDate: ''
                });
            };
        });
    };

    const resetForm = () => {
        document.getElementById("removePurForm").reset();
        setPurDetails({
            purchaseId: '',
            itemName: '',
            itemNumber: '',
            quantity: '',
            unitPrice: '',
            vendorName: '',
            vendorId: '',
            purchaseDate: ''
        });
    };
    
    const handleModalClose = () => setModalShow(false);

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
                                <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={modalShow} onHide={handleModalClose} animation={true}>
                                    <Modal.Header closeButton>
                                        <Modal.Title><h5>Delete Confirmation</h5></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Do you really want to delete this purchase?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={handleModalClose}>Cancel</Button>
                                        <Button variant="danger" size="sm" onClick={() => deletePurchaseById()}>Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={cardStyleHeader}>
                                            Remove Purchase
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="removePurForm">
                                                <Alert variant={notif.variant} show={notif.status} onClose={() => setNotif({ status: false })} dismissible>{notif.message}</Alert>
                                                <Row>
                                                    <Form.Group as={Col} sm={2} className="mb-3">
                                                        <Form.Label>Purchase ID<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="ID"
                                                            list="purchaseId"
                                                            value={purDetails.purchaseId}
                                                            onChange={e => handlePurchaseIDChange(e)}
                                                        />
                                                        <datalist id="purchaseId">
                                                            {purList.length >= 1 ? purList.map((pur, index) => {
                                                                return <option key={index} value={pur.purchaseId} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label>Item Name<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={purDetails.itemName}
                                                        />
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
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label>Quantity<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={purDetails.quantity}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label>Unit Price<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={purDetails.unitPrice}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label>Vendor Name<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={purDetails.vendorName}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Vendor ID<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            min={0}
                                                            disabled
                                                            value={purDetails.vendorId}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Purchase Date<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={purDetails.purchaseDate}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Button
                                                type='submit'
                                                variant="danger"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={handleDeleteConfirmation}
                                            >
                                                Delete
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