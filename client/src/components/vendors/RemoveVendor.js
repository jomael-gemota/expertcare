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
    Modal,
} from 'react-bootstrap';
import {
    BsTrashFill,
    BsFillArrowLeftCircleFill,
    BsFillExclamationCircleFill,
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

export default function RemoveVendor() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [vendDetails, setVendDetails] = useState({});
    const [vendList, setVendList] = useState([]);
    const [modalShow, setModalShow] = useState(false);

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

    const handleVendorNameChange = (e) => {
        setVendDetails({ ...vendDetails, fullName: e.target.value });

        vendList.find(x => {
            if (x.fullName === e.target.value) {
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

    const deleteVendorById = () => {
        if (vendDetails.vendorId !== undefined) {
            if (vendDetails.vendorId !== "") {
                handleModalClose();

                axios.delete('/api/inv/deleteVendorById',
                    { params: { id: vendDetails.vendorId },
                    headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Vendor Deleted!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }))
                
                setTimeout(function() {
                    history.push('/home');
                }, 1500);
            };
        };

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleDeleteConfirmation = () => {
        if (vendDetails.vendorId !== undefined) {
            if (vendDetails.vendorId !== "") {
                setModalShow(true);
            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'warning', message: 'The vendor name does not exist in the system.' });
        
        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleModalClose = () => setModalShow(false);

    const resetForm = () => {
        document.getElementById("updateVendorForm").reset();
        setVendDetails({
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
                                <Modal
                                    size="md"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    show={modalShow}
                                    onHide={handleModalClose}
                                    animation={true}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title><h5><BsFillExclamationCircleFill /> Delete Confirmation</h5></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Alert variant='danger'><b>Note:</b> Once you delete a vendor, there is no going back. Please be certain.</Alert>
                                        Do you really want to delete this vendor?
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={handleModalClose}>Cancel</Button>
                                        <Button variant="danger" size="sm" onClick={() => deleteVendorById()}>Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                                <CardGroup>
                                    <Card style={cardStyles}>
                                        <Card.Header style={cardStyleHeader}>
                                            Remove Vendor
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="updateVendorForm">
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
                                                        <Form.Label style={formLabel}>Vendor Business Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            list="vendorName"
                                                            value={vendDetails.fullName}
                                                            onChange={e => handleVendorNameChange(e)}
                                                        />
                                                        <datalist id="vendorName">
                                                            {vendList.length >= 1 ? vendList.map((vend, index) => {
                                                                return <option key={index} value={vend.fullName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Vendor ID</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            disabled
                                                            placeholder=""
                                                            value={vendDetails.vendorId}
                                                            onChange={e => setVendDetails({ ...vendDetails, vendorId: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Mobile No.</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={vendDetails.mobile}
                                                            onChange={e => setVendDetails({ ...vendDetails, mobile: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>Email Address</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="email"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={vendDetails.email}
                                                            onChange={e => setVendDetails({ ...vendDetails, email: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Phone No.</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={vendDetails.phone}
                                                            onChange={e => setVendDetails({ ...vendDetails, phone: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Full Address</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={vendDetails.address}
                                                            onChange={e => setVendDetails({ ...vendDetails, address: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>City</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={vendDetails.city}
                                                            onChange={e => setVendDetails({ ...vendDetails, city: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>District</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
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
                                                variant="danger"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={() => handleDeleteConfirmation()}
                                            >
                                                <BsTrashFill /> Delete Vendor
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