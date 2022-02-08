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
    Alert,
    Badge,
} from 'react-bootstrap';
import {
    BsFillBagFill,
    BsPlusCircleFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs';

import {
    homeContainer,
    cardStyleHeader,
    formLabel
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function AddNewProduct() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [prodDetails, setProdDetails] = useState({});

    const addNewProduct = () => {
        const {
            itemName,
            itemNumber,
            units,
            unitPrice,
            stock
        } = prodDetails;

        if (prodDetails.discount === undefined) {
            prodDetails.discount = 0
        };
        if (prodDetails.description === undefined) prodDetails.description = "";

        if (itemName !== undefined && itemNumber !== undefined && units !== undefined && unitPrice !== undefined && stock !== undefined) {
            axios.post('/api/inv/addNewProduct', prodDetails,
                { headers: { Authorization: getJwt() } })
                .then(() => {
                    setNotif({ status: true, variant: 'success', message: 'Product Added!' });
                    resetForm();
                })
                .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))
        } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' })

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const resetForm = () => {
        document.getElementById("addNewProdForm").reset();
        setProdDetails({
            itemName: '',
            itemNumber: '',
            units: '',
            unitPrice: '',
            stock: '',
            discount: '',
            description: ''
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
                                        <Card.Header style={cardStyleHeader}><BsFillBagFill /> Add New Product</Card.Header>
                                        <Card.Body>
                                            <Form id="addNewProdForm">
                                                <Alert
                                                    dismissible
                                                    variant={notif.variant}
                                                    show={notif.status}
                                                    onClose={() => setNotif({ status: false })}
                                                >
                                                        {notif.message}
                                                </Alert>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={prodDetails.itemName}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemName: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Number <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={prodDetails.itemNumber}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemNumber: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Units <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={prodDetails.units}
                                                            onChange={e => setProdDetails({ ...prodDetails, units: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            value={prodDetails.unitPrice}
                                                            onChange={e => setProdDetails({ ...prodDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Stock <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={prodDetails.stock}
                                                            onChange={e => setProdDetails({ ...prodDetails, stock: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Disc. % <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={prodDetails.discount}
                                                            onChange={e => setProdDetails({ ...prodDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>Description <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={5}
                                                            type="text"
                                                            placeholder=""
                                                            value={prodDetails.description}
                                                            onChange={e => setProdDetails({ ...prodDetails, description: e.target.value })}
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
                                                onClick={addNewProduct}
                                            >
                                                <BsPlusCircleFill /> Add Product
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