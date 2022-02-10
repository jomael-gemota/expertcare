import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    Alert,
    Badge,
} from 'react-bootstrap';
import {
    BsBasketFill,
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

export default function UpdatePurchase() {
    const [notif, setNotif] = useState({ status: false });
    const [purDetails, setPurDetails] = useState({});
    const [prodList, setProdList] = useState([]);
    const [vendList, setVendList] = useState([]);
    const [purList, setPurList] = useState([]);

    useEffect(() => {
        axios.get('/api/inv/getAllProducts',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let prodArr = [];
                res.data.message.map(prod => {
                    return prodArr.push({
                        prodId: prod.productID,
                        itemNumber: prod.itemNumber,
                        itemName: prod.itemName,
                        discount: prod.discount,
                        stock: prod.stock,
                        unitPrice: prod.unitPrice,
                        desc: prod.description
                    });
                });
    
                return setProdList(prodArr);

            }).catch(error => setProdList({ key: error.name, text: error.message }));

        axios.get('/api/inv/getAllVendors',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let vendArr = [];
                res.data.message.map(vendor => {
                    return vendArr.push({ vendorId: vendor.vendorID, vendorName: vendor.fullName });
                });
    
                return setVendList(vendArr);

            }).catch(error => setVendList({ key: error.name, text: error.message }));

        axios.get('/api/inv/getAllPurchase',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let purArr = [];
                res.data.message.map(pur => {
                    return purArr.push({
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

    const updatePurchaseById = () => {
        const {
            itemName,
            itemNumber,
            quantity,
            unitPrice,
            vendorName,
            purchaseDate
        } = purDetails;

        if (itemName !== undefined && itemNumber !== undefined && quantity !== undefined && unitPrice !== undefined && vendorName !== undefined && purchaseDate !== undefined) {
            if (itemName !== "" && itemNumber !== "" && quantity !== "" && unitPrice !== "" && vendorName !== "" && purchaseDate !== "") {
                axios.patch('/api/inv/updatePurchaseById', purDetails,
                    { headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Purchase Updated!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }));
            } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 3000);
    };

    const handlePurchaseIDChange = (e) => {
        setPurDetails({ ...purDetails, purchaseId: e.target.value });

        purList.find(x => {
            if (x.purchaseId === Number(e.target.value)) {
                return setPurDetails({
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
        });

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
    };

    const handleItemNameChange = (e) => {
        setPurDetails({ ...purDetails, itemName: e.target.value });
        return prodList.find(x => {
            if (x.itemName === e.target.value) {
                return setPurDetails({
                    ...purDetails,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber
                });
            };
        });
    };

    const handleVendorNameChange = (e) => {
        setPurDetails({ ...purDetails, vendorName: e.target.value });
        return vendList.find(x => {
            if (x.vendorName === e.target.value) {
                return setPurDetails({
                    ...purDetails,
                    vendorName: x.vendorName,
                    vendorId: x.vendorId
                });
            };
        });
    };

    const resetForm = () => {
        document.getElementById("updatePurForm").reset();
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
                                            <BsBasketFill /> Edit Purchase
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="updatePurForm">
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
                                                        <Form.Label style={formLabel}>Purchase ID <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
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
                                                    <Form.Group as={Col} sm={5} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="itemName"
                                                            value={purDetails.itemName}
                                                            onChange={e => handleItemNameChange(e)}
                                                        />
                                                        <datalist id="itemName">
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                return <option key={index} value={prod.itemName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Number <Badge bg="secondary">Generated</Badge></Form.Label>
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
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Quantity <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={purDetails.quantity}
                                                            onChange={e => setPurDetails({ ...purDetails, quantity: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={purDetails.unitPrice}
                                                            onChange={e => setPurDetails({ ...purDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>Vendor Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="vendorName"
                                                            min={0}
                                                            value={purDetails.vendorName}
                                                            onChange={e => handleVendorNameChange(e)}
                                                        />
                                                        <datalist id="vendorName">
                                                            {vendList.length >= 1 ? vendList.map((vendor, index) => {
                                                                return <option key={index} value={vendor.vendorName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Vendor ID <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            min={0}
                                                            disabled
                                                            value={purDetails.vendorId}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Date <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={purDetails.purchaseDate}
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
                                                onClick={updatePurchaseById}
                                            >
                                                <BsPencilFill /> Update Purchase
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