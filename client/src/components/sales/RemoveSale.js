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
    Badge,
} from 'react-bootstrap';

import {
    homeContainer,
    navBarStyles,
    navBarBrand,
    spanIms,
    cardStyleHeader,
    formLabel
} from '../../css/styles';

export default function RemoveSale() {
    const history = useHistory();
    const [salesList, setSalesList] = useState([]);
    const [saleDetails, setSaleDetails] = useState([]);
    const [notif, setNotif] = useState({ status: false });
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        axios.get('/api/inv/getAllSales',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let salesArr = [];
                res.data.message.map((sale, index) => {
                    const { saleID, customerName, itemName, itemNumber, saleDate, discount, quantity, unitPrice } = sale;
                    salesArr.push({
                        saleId: saleID,
                        customerName: customerName,
                        itemName: itemName,
                        itemNumber: itemNumber,
                        saleDate: saleDate,
                        discount: discount,
                        quantity: quantity,
                        unitPrice: unitPrice
                    });
                });

                return setSalesList(salesArr);

            }).catch(error => setSalesList({ key: error.name, text: error.message }));
    }, [saleDetails.saleId]);

    const deleteSaleBySaleId = () => {
        if (saleDetails.saleId !== undefined) {
            handleModalClose();

            axios.delete('/api/inv/deleteSaleBySaleId',
                { params: { id: saleDetails.saleId },
                headers: { Authorization: getJwt() } })
                .then(() => setNotif({ status: true, variant: 'success', message: 'Sale Deleted!' }))
                .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))

            setSaleDetails({
                saleId: '',
                customerName: '',
                itemName: '',
                itemNumber: '',
                saleDate: '',
                discount: '',
                quantity: '',
                unitPrice: ''
            });
        };

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 3000);
    };
    
    const handleDeleteConfirmation = () => {
        if (saleDetails.saleId !== undefined) {
            setModalShow(true);
        } else {
            setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
        };

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 3000);
    };
    
    const handleSaleIdChange = (e) => {
        salesList.find(x => {
            if (x.saleId === Number(e.target.value)) {
                setSaleDetails({
                    saleId: x.saleId,
                    customerName: x.customerName,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    saleDate: moment(x.saleDate).format('MM/DD/YYYY'),
                    discount: x.discount,
                    quantity: x.quantity,
                    unitPrice: x.unitPrice
                });
            };
        });

        if (e.target.value === "") {
            setSaleDetails({
                customerName: '',
                itemName: '',
                itemNumber: '',
                saleDate: '',
                discount: '',
                quantity: '',
                unitPrice: ''
            });
        };
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
                                <Navbar.Brand href="/home" style={navBarBrand}>
                                    EXPERT CARE <span style={spanIms}>Inventory Management System Pharmacy</span>
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="navbarScroll" />
                                <Navbar.Collapse id="navbarScroll">
                                    <Nav
                                        className="me-auto my-2 my-lg-0"
                                        style={{ maxHeight: '100px' }}
                                        navbarScroll
                                    >
                                    </Nav>
                                    <span style={{ color: 'white' }}>
                                        Welcome Staff! | <Button size="sm" variant="danger" onClick={logOut}>Log Out</Button>
                                    </span>
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
                                <Modal
                                    size="md"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    show={modalShow}
                                    onHide={handleModalClose}
                                    animation={true}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title><h5>Delete Confirmation</h5></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Do you really want to delete this sale?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={handleModalClose}>Cancel</Button>
                                        <Button variant="danger" size="sm" onClick={() => deleteSaleBySaleId()}>Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={cardStyleHeader}>Remove Sale</Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Alert
                                                    dismissible
                                                    variant={notif.variant}
                                                    show={notif.status}
                                                    onClose={() => setNotif({ status: false })}
                                                >{notif.message}</Alert>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Sale ID <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="saleId"
                                                            value={saleDetails.saleId}
                                                            onChange={e => handleSaleIdChange(e)}
                                                        />
                                                        <datalist id="saleId">
                                                            {salesList.length >= 1 ? salesList.map((sale, index) => {
                                                                const { saleId  } = sale;
                                                                return <option key={index} value={saleId} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Customer Name <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="customerName"
                                                            disabled
                                                            value={saleDetails.customerName}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form id="updateSaleForm">
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list='itemName'
                                                            disabled
                                                            value={saleDetails.itemName}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Number <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={saleDetails.itemNumber}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Quantity <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            disabled
                                                            value={saleDetails.quantity}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Disc. % <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            disabled
                                                            value={saleDetails.discount}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={saleDetails.unitPrice}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Sale Date <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={saleDetails.saleDate}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button
                                                type='submit'
                                                variant="danger"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={handleDeleteConfirmation}
                                            >
                                                Delete Sale
                                            </Button>
                                            <Link to="/home"><Button size="sm" variant="outline-secondary">Go Back</Button></Link>
                                        </Card.Footer>
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