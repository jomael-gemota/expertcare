import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
    Alert,
    Badge,
} from 'react-bootstrap';
import {
    BsFillPersonPlusFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs';
import { FaInfo } from 'react-icons/fa';

import {
    homeContainer,
    cardStyleHeader,
    formLabel,
    sidebarStyles,
    cardStyles,
    formControl,
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function AddNewCustomer() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [cxDetails, setCxDetails] = useState({});
    const [cxList, setCxList] = useState([]);

    useEffect(() => {
        axios.get('/api/inv/getCustomerDatabase',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let cxArr = [];
                res.data.message.map(cx => {
                    return cxArr.push({
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

    const addNewCustomer = () => {
        const {
            fullName,
            mobile
        } = cxDetails;

        let isCxExist = false;
        cxList.find(x => { if (x.fullName === fullName) isCxExist = true });

        if (isCxExist !== true) {
            if (fullName !== undefined && mobile !== undefined) {
                if (fullName !== "" && mobile !== "") {
                    axios.post('/api/inv/addNewCustomer', cxDetails,
                        { headers: { Authorization: getJwt() } })
                        .then(() => {
                            setNotif({ status: true, variant: 'success', message: 'Patient Record Added!' });
                            resetForm();
                        })
                        .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }))
    
                    setTimeout(function() {
                        history.push('/home');
                    }, 1500);
    
                } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'warning', message: 'You have entered an existing patient name.' });

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
                <Row>
                    <Col sm={2} style={sidebarStyles}>
                        <SideBar />
                    </Col>
                    <Col sm={6}>
                        <Tab.Content style={{ margin: '100px 20px 30px 50px' }}>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card style={cardStyles}>
                                        <Card.Header style={cardStyleHeader}>
                                            Add New Patient Record
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="addNewCustomerForm">
                                                <Alert
                                                    dismissible
                                                    variant={notif.variant}
                                                    show={notif.status}
                                                    onClose={() => setNotif({ status: false })}
                                                >
                                                    <FaInfo /> {notif.message}
                                                </Alert>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Patient Full Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            list="customerName"
                                                            value={cxDetails.fullName}
                                                            onChange={e => setCxDetails({ ...cxDetails, fullName: e.target.value })}
                                                        />
                                                        <datalist id="customerName">
                                                            {cxList.length >= 1 ? cxList.map((cx, index) => {
                                                                return <option key={index} value={cx.fullName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Mobile No. <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            value={cxDetails.mobile}
                                                            onChange={e => setCxDetails({ ...cxDetails, mobile: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Email Address <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="email"
                                                            placeholder=""
                                                            value={cxDetails.email}
                                                            onChange={e => setCxDetails({ ...cxDetails, email: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Phone No. <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            value={cxDetails.phone}
                                                            onChange={e => setCxDetails({ ...cxDetails, phone: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Chief Complaint <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            value={cxDetails.illness}
                                                            onChange={e => setCxDetails({ ...cxDetails, illness: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Patient Current Address <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            value={cxDetails.address}
                                                            onChange={e => setCxDetails({ ...cxDetails, address: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>City <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            value={cxDetails.city}
                                                            onChange={e => setCxDetails({ ...cxDetails, city: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>District <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
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
                                                <BsFillPersonPlusFill /> Add Record
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