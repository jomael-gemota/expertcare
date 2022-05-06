import React, { useState, useEffect } from 'react';
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

export default function AddNewProduct() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [prodDetails, setProdDetails] = useState({});
    const [prodList, setProdList] = useState([]);

    useEffect(() => {
        axios.get('/api/inv/getAllProducts',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let prodArr = [];
                res.data.message.map(prod => {
                    return prodArr.push({
                        productId: prod.productID,
                        itemName: prod.itemName,
                        itemNumber: prod.itemNumber,
                        units: prod.units,
                        unitPrice: prod.unitPrice,
                        stock: prod.stock,
                        discount: prod.discount,
                        description: prod.description
                    });
                });
    
                return setProdList(prodArr);

            }).catch(error => setProdList({ key: error.name, text: error.message }));
    }, []);

    const addNewProduct = () => {
        const {
            itemName,
            itemNumber,
            units,
            unitPrice,
            stock
        } = prodDetails;

        let isProdExist = false;
        prodList.find(x => { if (x.itemName === itemName) isProdExist = true });

        if (isProdExist !== true) {
            if (prodDetails.discount === undefined) {
                prodDetails.discount = 0
            };
            if (prodDetails.description === undefined) prodDetails.description = "";
    
            if (itemName !== undefined && itemNumber !== undefined && units !== undefined && unitPrice !== undefined && stock !== undefined) {
                if (itemName !== "" && itemNumber !== "" && units !== "" && unitPrice !== "" && stock !== "") {
                    axios.post('/api/inv/addNewProduct', prodDetails,
                        { headers: { Authorization: getJwt() } })
                        .then(() => {
                            setNotif({ status: true, variant: 'success', message: 'Product Added!' });
                            resetForm();
                        })
                        .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }))
                    
                    setTimeout(function() {
                        history.push('/home');
                    }, 1500);
                }
            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' })
        } else {
            setNotif({ status: true, variant: 'warning', message: 'You have entered an existing product.' })
        };

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
                <Row>
                    <Col sm={2} style={ sidebarStyles }>
                        <SideBar />
                    </Col>
                    <Col sm={8}>
                        <Tab.Content style={{ margin: '100px 20px 30px 50px' }}>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card style={cardStyles}>
                                        <Card.Header style={cardStyleHeader}>Add New Product</Card.Header>
                                        <Card.Body>
                                            <Form id="addNewProdForm">
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
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge> <Badge bg='primary'>Unique</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            disabled={prodList.length > 0 ? false : true}
                                                            placeholder={prodList.length > 0 ? "" : "Loading..."}
                                                            list="productName"
                                                            value={prodDetails.itemName}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemName: e.target.value })}
                                                        />
                                                        <datalist id="productName">
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                const { itemName  } = prod;
                                                                return <option key={index} value={itemName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Number <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            disabled={prodList.length > 0 ? false : true}
                                                            placeholder={prodList.length > 0 ? "" : "Loading..."}
                                                            list="itemNumber"
                                                            value={prodDetails.itemNumber}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemNumber: e.target.value })}
                                                        />
                                                        <datalist id="itemNumber">
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                const { itemNumber  } = prod;
                                                                return <option key={index} value={itemNumber} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Units <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            value={prodDetails.units}
                                                            onChange={e => setProdDetails({ ...prodDetails, units: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            value={prodDetails.unitPrice}
                                                            onChange={e => setProdDetails({ ...prodDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Stock <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={prodDetails.stock}
                                                            onChange={e => setProdDetails({ ...prodDetails, stock: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Disc. % <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={prodDetails.discount}
                                                            onChange={e => setProdDetails({ ...prodDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={12} className="mb-3">
                                                        <Form.Label style={formLabel}>Description <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
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