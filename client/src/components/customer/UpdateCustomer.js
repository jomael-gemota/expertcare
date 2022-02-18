import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    BsFillPencilFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs';

import {
    homeContainer,
    cardStyleHeader,
    formLabel
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function UpdateCustomer() {
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

    const updateCustomerById = () => {
        const {
            customerId,
            fullName,
            illness,
            address,
            district,
        } = cxDetails;

        if (customerId !== undefined && illness !== undefined && fullName !== undefined && address !== undefined && district !== undefined) {
            if (customerId !== "" && illness !== "" && fullName !== "" && address !== "" && district !== "") {
                axios.patch('/api/inv/updateCustomerById', cxDetails,
                    { headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Customer Information Updated!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }))
            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleCustomerIdChange = (e) => {
        let objCxDetails = {};

        setCxDetails({ ...cxDetails, customerId: e.target.value });

        cxList.find(x => {
            if (x.customerId === Number(e.target.value)) {
                objCxDetails = {
                    customerId: x.customerId,
                    fullName: x.fullName,
                    illness: x.illness,
                    email: x.email,
                    mobile: x.mobile,
                    phone: x.phone,
                    address: x.address,
                    city: x.city,
                    district: x.district
                };
            };

            return setCxDetails(objCxDetails);
        });

        if (e.target.value === "") resetForm();
    };

    const resetForm = () => {
        document.getElementById("updateCustomerForm").reset();
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
                                            Edit Customer Info
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="updateCustomerForm">
                                                <Alert
                                                    dismissible
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
                                                            disabled={cxList.length > 0 ? false : true}
                                                            placeholder={cxList.length > 0 ? "" : "Loading..."}
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
                                                        <Form.Label style={formLabel}>Chief Complaint <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={cxDetails.illness}
                                                            onChange={e => setCxDetails({ ...cxDetails, illness: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Full Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
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
                                                            value={cxDetails.email}
                                                            onChange={e => setCxDetails({ ...cxDetails, email: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
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
                                                onClick={() => updateCustomerById()}
                                            >
                                                <BsFillPencilFill /> Update Customer Info
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