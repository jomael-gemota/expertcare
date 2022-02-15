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
    BsHouseFill,
    BsPencilFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs';

import {
    homeContainer,
    cardStyleHeader,
    formLabel
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function UpdateVendor() {
    const [notif, setNotif] = useState({ status: false });
    const [vendDetails, setVendDetails] = useState({});
    const [vendList, setVendList] = useState([]);

    useEffect(() => {
        axios.get('/api/inv/getAllVendors',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let vendArr = [];
                res.data.message.map(vendor => {
                    return vendArr.push({
                        vendorId: vendor.vendorID,
                        fullName: vendor.fullName,
                        email: vendor.email,
                        mobile: vendor.mobile,
                        phone: vendor.phone2,
                        address: vendor.address,
                        city: vendor.city,
                        district: vendor.district
                    });
                });
    
                return setVendList(vendArr);

            }).catch(error => setVendList({ key: error.name, text: error.message }));
    }, [vendDetails.vendorId]);

    const handleVendorIdChange = (e) => {
        setVendDetails({ ...vendDetails, vendorId: e.target.value });
        vendList.find(x => {
            if (x.vendorId === Number(e.target.value)) {
                setVendDetails({
                    vendorId: x.vendorId,
                    fullName: x.fullName,
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

    const updateVendorById = () => {
        const {
            vendorId,
            fullName,
            address,
            district,
        } = vendDetails;

        if (vendorId !== undefined && fullName !== undefined && address !== undefined && district !== undefined) {
            if (vendorId !== "" && fullName !== "" && address !== "" && district !== "") {
                axios.patch('/api/inv/updateVendorById', vendDetails,
                    { headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Vendor Updated!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }))
            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const resetForm = () => {
        document.getElementById("updateVendorForm").reset();
        setVendDetails({
            vendorId: '',
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
                                            <BsHouseFill /> Edit Vendor
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="updateVendorForm">
                                                <Alert
                                                    dismissible
                                                    variant={notif.variant}
                                                    show={notif.status}
                                                    onClose={() => setNotif({ status: false })}
                                                >
                                                    {notif.message}
                                                </Alert>
                                                <Row>
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Vendor ID <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="vendorId"
                                                            value={vendDetails.vendorId}
                                                            onChange={e => handleVendorIdChange(e)}
                                                        />
                                                        <datalist id="vendorId">
                                                            {vendList.length >= 1 ? vendList.map((vend, index) => {
                                                                return <option key={index} value={vend.vendorId} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Full Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={vendDetails.fullName}
                                                            onChange={e => setVendDetails({ ...vendDetails, fullName: e.target.value })}
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
                                                            min={0}
                                                            value={vendDetails.email}
                                                            onChange={e => setVendDetails({ ...vendDetails, email: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Mobile No. <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            value={vendDetails.mobile}
                                                            onChange={e => setVendDetails({ ...vendDetails, mobile: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Phone No. <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            value={vendDetails.phone}
                                                            onChange={e => setVendDetails({ ...vendDetails, phone: e.target.value })}
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
                                                            value={vendDetails.address}
                                                            onChange={e => setVendDetails({ ...vendDetails, address: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>City <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={vendDetails.city}
                                                            onChange={e => setVendDetails({ ...vendDetails, city: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>District <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={vendDetails.district}
                                                            onChange={e => setVendDetails({ ...vendDetails, district: e.target.value })}
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
                                                onClick={() => updateVendorById()}
                                            >
                                                <BsPencilFill /> Update Vendor
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