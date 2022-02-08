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
    Alert,
    Badge,
} from 'react-bootstrap';
import {
    BsFillPeopleFill,
    BsFillPersonPlusFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs';

import {
    homeContainer,
    cardStyleHeader,
    formLabel
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function AddNewCustomer() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [cxDetails, setCxDetails] = useState({});

    const addNewCustomer = () => {
        const {
            fullName,
            address,
            district
        } = cxDetails;

        if (fullName !== undefined && address !== undefined && district !== undefined) {
            if (fullName !== "" && address !== "" && district !== "") {
                axios.post('/api/inv/addNewCustomer', cxDetails,
                    { headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Customer Information Added!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))
            } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const resetForm = () => {
        document.getElementById("addNewCustomerForm").reset();
        setCxDetails({
            fullName: '',
            email: '',
            mobile: '',
            phone: '',
            address: '',
            city: '',
            district: ''
        });
    };

    return (
        <div style={homeContainer}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col>
                        <NavigationBar />
                    </Col>
                </Row>
                <br />
                <br />
                <Row style={{ padding: '3%' }}>
                    <Col sm={2}>
                        <SideBar />
                    </Col>
                    <Col sm={6}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={cardStyleHeader}>
                                            <BsFillPeopleFill /> Add New Customer
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="addNewCustomerForm">
                                                <Alert
                                                    variant={notif.variant}
                                                    show={notif.status}
                                                    onClose={() => setNotif({ status: false })}
                                                >
                                                    {notif.message}
                                                </Alert>
                                                <Row>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>Full Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={cxDetails.fullName}
                                                            onChange={e => setCxDetails({ ...cxDetails, fullName: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>Illness <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={cxDetails.illness}
                                                            onChange={e => setCxDetails({ ...cxDetails, illness: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Email Address <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder=""
                                                            value={cxDetails.email}
                                                            onChange={e => setCxDetails({ ...cxDetails, email: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>Mobile No. <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            value={cxDetails.mobile}
                                                            onChange={e => setCxDetails({ ...cxDetails, mobile: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Phone No. <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
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
                                                            value={cxDetails.city}
                                                            onChange={e => setCxDetails({ ...cxDetails, city: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>District <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
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
                                                variant="success"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={addNewCustomer}
                                            >
                                                <BsFillPersonPlusFill /> Add Customer
                                            </Button>
                                            <Link to="/home"><Button size="sm" variant="outline-secondary"><BsFillArrowLeftCircleFill /> Go Back</Button></Link>
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