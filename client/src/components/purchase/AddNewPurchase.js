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
    BsPlusCircleFill,
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

export default function AddNewPurchase() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [purDetails, setPurDetails] = useState({});
    const [prodList, setProdList] = useState([]);
    const [vendList, setVendList] = useState([]);

    useEffect(() => {
        axios.get('/api/inv/getAllProducts',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let prodArr = [];
                res.data.message.map(prod => {
                    return prodArr.push({
                        productId: prod.productID,
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
    }, []);

    const addNewPurchase = () => {
        const {
            productId,
            itemName,
            itemNumber,
            currStock,
            quantity,
            unitPrice,
            vendorName,
            purchaseDate
        } = purDetails;

        if (itemName !== undefined && itemNumber !== undefined && quantity !== undefined && unitPrice !== undefined && vendorName !== undefined && purchaseDate !== undefined) {
            if (itemName !== "" && itemNumber !== "" && quantity !== "" && unitPrice !== "" && vendorName !== "" && purchaseDate !== "") {
                axios.post('/api/inv/addNewPurchase', purDetails,
                    { headers: { Authorization: getJwt() } })
                    .then(() => {
                        let prodDetails = {
                            productId: productId,
                            itemName: itemName,
                            itemNumber: itemNumber,
                            stock: Number(currStock) + Number(quantity)
                        };

                        axios.patch('/api/inv/updateProductById', prodDetails,
                            { headers: { Authorization: getJwt() } })
                            .then()
                            .catch();

                        setNotif({ status: true, variant: 'success', message: 'Purchase Added!' });
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

    const handleItemNameChange = (e) => {
        let objPurDetails = {};
        setPurDetails({ ...purDetails, itemName: e.target.value });

        prodList.find(x => {
            if (x.itemName === e.target.value) {
                objPurDetails = {
                    ...purDetails,
                    productId: x.productId,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    currStock: x.stock
                };
            };

            return setPurDetails(objPurDetails);
        });

        if (e.target.value === "") {
            setPurDetails({
                itemName: "",
                itemNumber: "",
                quantity: "",
                unitPrice: "",
                vendorName: "",
                purchaseDate: ""
            });
        };
    };

    const handleVendorNameChange = (e) => {
        let objPurDetails = {};
        setPurDetails({ ...purDetails, vendorName: e.target.value });

        return vendList.find(x => {
            if (x.vendorName === e.target.value) {
                objPurDetails = {
                    ...purDetails,
                    vendorName: x.vendorName,
                    vendorId: x.vendorId
                };
            };

            return setPurDetails(objPurDetails);
        });
    };

    const resetForm = () => {
        document.getElementById("addNewPurForm").reset();
        setPurDetails({
            itemName: '',
            itemNumber: '',
            quantity: '',
            unitPrice: '',
            vendorName: '',
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
                <Row>
                    <Col sm={2} style={ sidebarStyles }>
                        <SideBar />
                    </Col>
                    <Col sm={6}>
                        <Tab.Content style={{ margin: '100px 20px 30px 50px' }}>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card style={cardStyles}>
                                        <Card.Header style={cardStyleHeader}>
                                            Add New Purchase
                                        </Card.Header>
                                        <Card.Body>
                                            <Form id="addNewPurForm">
                                                <Alert
                                                    dismissible
                                                    variant={notif.variant}
                                                    show={notif.status}
                                                    onClose={() => setNotif({ status: false })}
                                                >
                                                    <FaInfo /> {notif.message}
                                                </Alert>
                                                <Row>
                                                    <Form.Group as={Col} sm={7} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
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
                                                        <Form.Label style={formLabel}>Item Number</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
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
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={purDetails.quantity}
                                                            onChange={e => setPurDetails({ ...purDetails, quantity: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={purDetails.unitPrice}
                                                            onChange={e => setPurDetails({ ...purDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={7} className="mb-3">
                                                        <Form.Label style={formLabel}>Vendor Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
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
                                                    <Form.Group as={Col} sm={5} className="mb-3">
                                                        <Form.Label style={formLabel}>Purchase Date <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="date"
                                                            placeholder=""
                                                            value={purDetails.purchaseDate}
                                                            onChange={e => setPurDetails({ ...purDetails, purchaseDate: e.target.value })}
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
                                                onClick={addNewPurchase}
                                            >
                                                <BsPlusCircleFill /> Add Purchase
                                            </Button>
                                            <Link to="/home"><Button size="sm" variant="outline-secondary"><BsFillArrowLeftCircleFill />Go Back</Button></Link>
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