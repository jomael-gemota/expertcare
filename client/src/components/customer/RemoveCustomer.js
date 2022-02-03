import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
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
    Badge,
    Modal,
} from 'react-bootstrap';

import {
    homeContainer,
    navBarStyles,
    navBarBrand,
    spanIms,
    cardStyleHeader,
    formLabel
} from '../../css/styles';

export default function RemoveCustomer() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [cxDetails, setCxDetails] = useState({});
    const [cxList, setCxList] = useState([]);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        axios.get('/api/inv/getCustomerDatabase',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let cxArr = [];
                res.data.message.map(cx => {
                    cxArr.push({
                        customerId: cx.customerID,
                        fullName: cx.fullName,
                        illness: cx.illness,
                        email: cx.email,
                        mobile: cx.mobile,
                        phone: cx.phone2,
                        address: cx.address,
                        city: cx.city,
                        district: cx.district
                    });
                });
    
                return setCxList(cxArr);

            }).catch(error => setCxList({ key: error.name, text: error.message }));
    }, [cxDetails.customerId]);

    const handleCustomerIdChange = (e) => {
        setCxDetails({ ...cxDetails, customerId: e.target.value });
        cxList.find(x => {
            if (x.customerId === Number(e.target.value)) {
                setCxDetails({
                    customerId: x.customerId,
                    fullName: x.fullName,
                    illness: x.illness,
                    email: x.email,
                    mobile: x.mobile,
                    phone: x.phone,
                    address: x.address,
                    city: x.city,
                    district: x.district
                });
            };
        });

        if (e.target.value === "") resetForm();
    };

    const deleteCustomerById = () => {
        if (cxDetails.customerId !== undefined) {
            if (cxDetails.customerId !== "") {
                handleModalClose();

                axios.delete('/api/inv/deleteCustomerById',
                    { params: { id: cxDetails.customerId },
                    headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Customer Information Deleted!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))
            } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleDeleteConfirmation = () => {
        if (cxDetails.customerId !== undefined) {
            if (cxDetails.customerId !== "") {
                setModalShow(true);
            } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
        
        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 3000);
    };

    const handleModalClose = () => setModalShow(false);

    const resetForm = () => {
        document.getElementById("deleteCustomerForm").reset();
        setCxDetails({
            customerId: '',
            fullName: '',
            illness: '',
            email: '',
            mobile: '',
            phone: '',
            address: '',
            city: '',
            district: ''
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
                                    <Modal.Body>Do you really want to delete this customer information?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={handleModalClose}>Cancel</Button>
                                        <Button variant="danger" size="sm" onClick={() => deleteCustomerById()}>Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={cardStyleHeader}>
                                            Delete Vendor
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="deleteCustomerForm">
                                                <Alert
                                                    variant={notif.variant}
                                                    show={notif.status}
                                                    onClose={() => setNotif({ status: false })}
                                                >
                                                    {notif.message}
                                                </Alert>
                                                <Row>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Customer ID <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="customerId"
                                                            value={cxDetails.customerId}
                                                            onChange={e => handleCustomerIdChange(e)}
                                                        />
                                                        <datalist id="customerId">
                                                            {cxList.length >= 1 ? cxList.map((cx, index) => {
                                                                return <option key={index} value={cx.customerId} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Illness <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.illness}
                                                            onChange={e => setCxDetails({ ...cxDetails, illness: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Full Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.fullName}
                                                            onChange={e => setCxDetails({ ...cxDetails, fullName: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Email Address <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.email}
                                                            onChange={e => setCxDetails({ ...cxDetails, email: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Mobile No. <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.mobile}
                                                            onChange={e => setCxDetails({ ...cxDetails, mobile: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Phone No. <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.phone}
                                                            onChange={e => setCxDetails({ ...cxDetails, phone: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Full Address <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.address}
                                                            onChange={e => setCxDetails({ ...cxDetails, address: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>City <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.city}
                                                            onChange={e => setCxDetails({ ...cxDetails, city: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>District <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.district}
                                                            onChange={e => setCxDetails({ ...cxDetails, district: e.target.value })}
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
                                                onClick={() => handleDeleteConfirmation()}
                                            >
                                                Remove Customer Info
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