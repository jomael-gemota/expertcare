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
    BsBackspaceReverseFill,
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

    const handleCustomerNameChange = (e) => {
        let objCxDetails = {};

        setCxDetails({ ...cxDetails, fullName: e.target.value });
        
        cxList.find(function(x) {
            if (x.fullName === e.target.value) {
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
                }
            };

            return setCxDetails(objCxDetails);
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
                    .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }))

                setTimeout(function() {
                    history.push('/home');
                }, 1500);

            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleDeleteConfirmation = () => {
        let isCxExist = false;
        cxList.find(x => { if (x.fullName === cxDetails.fullName) isCxExist = true });

        if (isCxExist === true) {
            if (cxDetails.customerId !== undefined) {
                if (cxDetails.customerId !== "") {
                    setModalShow(true);
                } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'warning', message: 'The patient name does not exist in the system.' });
        
        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
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
                                        <Alert variant='danger'><b>Note:</b> Once you delete a record, there is no going back. Please be certain.</Alert>
                                        Do you really want to delete this patient record?
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={handleModalClose}><BsBackspaceReverseFill /> Cancel</Button>
                                        <Button variant="danger" size="sm" onClick={() => deleteCustomerById()}><BsTrashFill /> Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                                <CardGroup>
                                    <Card style={cardStyles}>
                                        <Card.Header style={cardStyleHeader}>
                                            Delete Patient Record
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="deleteCustomerForm">
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
                                                            list="customerName"
                                                            value={cxDetails.fullName}
                                                            onChange={e => handleCustomerNameChange(e)}
                                                        />
                                                        <datalist id="customerName">
                                                            {cxList.length >= 1 ? cxList.map((cx, index) => {
                                                                return <option key={index} value={cx.fullName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Mobile No.</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.mobile}
                                                            onChange={e => setCxDetails({ ...cxDetails, mobile: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={2} className="mb-3">
                                                        <Form.Label style={formLabel}>Customer ID</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            disabled
                                                            placeholder=""
                                                            value={cxDetails.customerId}
                                                            onChange={e => setCxDetails({ ...cxDetails, customerId: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Email Address</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="email"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.email}
                                                            onChange={e => setCxDetails({ ...cxDetails, email: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Chief Complaint</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.illness}
                                                            onChange={e => setCxDetails({ ...cxDetails, illness: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Phone No.</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.phone}
                                                            onChange={e => setCxDetails({ ...cxDetails, phone: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Patient Current Address</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.address}
                                                            onChange={e => setCxDetails({ ...cxDetails, address: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>City</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={cxDetails.city}
                                                            onChange={e => setCxDetails({ ...cxDetails, city: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>District</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
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
                                                <BsTrashFill /> Remove Patient Record
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