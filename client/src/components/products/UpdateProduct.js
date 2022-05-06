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
    BsFillPencilFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs';
import { FaInfo } from 'react-icons/fa';

import {
    homeContainer,
    cardStyleHeader,
    formLabel,
    sidebarStyles,
    formControl,
    cardStyles,
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function UpdateProduct() {
    const history = useHistory();
    const [prodList, setProdList] = useState([]);
    const [prodDetails, setProdDetails] = useState([]);
    const [notif, setNotif] = useState({ status: false });

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
    }, [prodDetails.productId]);

    const updateProductById = () => {
        const {
            productId,
            itemName,
            itemNumber,
            units,
            unitPrice,
            stock,
        } = prodDetails;

        let isProdExist = false;
        prodList.find(x => { if (x.itemName === itemName) isProdExist = true });

        if (isProdExist === true) {
            if (productId !== undefined && itemName !== undefined && itemNumber !== undefined && units !== undefined && unitPrice !== undefined && stock !== undefined) {
                if (productId !== "" && itemName !== "" && itemNumber !== "" && units !== "" && unitPrice !== "" && stock !== "") {
                    axios.patch('/api/inv/updateProductById', prodDetails,
                        { headers: { Authorization: getJwt() } })
                        .then(() => setNotif({ status: true, variant: 'success', message: 'Product Updated!' }))
                        .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }));
    
                    setProdDetails({
                        productId: '',
                        itemName: '',
                        itemNumber: '',
                        units: '',
                        unitPrice: '',
                        stock: '',
                        discount: '',
                        description: ''
                    });
    
                    setTimeout(function() {
                        history.push('/home');
                    }, 1500);
    
                } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });   
        } else setNotif({ status: true, variant: 'warning', message: 'The item name does not exist in the system.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleProductNameChange = (e) => {
        let objProdDetails = {};

        setProdDetails({ ...prodDetails, itemName: e.target.value });

        prodList.find(x => {
            if (x.itemName === e.target.value) {
                objProdDetails = {
                    ...prodDetails,
                    productId: x.productId,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    units: x.units,
                    unitPrice: x.unitPrice,
                    stock: x.stock,
                    discount: x.discount,
                    description: x.description
                };
            };

            return setProdDetails(objProdDetails);
        });

        if (e.target.value === "") {
            setProdDetails({
                productId: '',
                itemName: '',
                itemNumber: '',
                units: '',
                unitPrice: '',
                stock: '',
                discount: '',
                description: ''
            });
        };
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
                    <Col sm={8}>
                        <Tab.Content style={{ margin: '100px 20px 30px 50px' }}>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card style={cardStyles}>
                                        <Card.Header style={cardStyleHeader}>
                                            Edit Product 
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
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
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            list="itemName"
                                                            disabled={prodList.length > 0 ? false : true}
                                                            placeholder={prodList.length > 0 ? "" : "Loading..."}
                                                            value={prodDetails.itemName}
                                                            onChange={e => handleProductNameChange(e)}
                                                        />
                                                        <datalist id="itemName">
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                const { itemName  } = prod;
                                                                return <option key={index} value={itemName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Product ID</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            disabled
                                                            type="text"
                                                            placeholder=""
                                                            value={prodDetails.productId}
                                                            onChange={e => setProdDetails({ ...prodDetails, productId: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form id="updateProductForm">
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Number <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            value={prodDetails.itemNumber}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemNumber: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Units <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            value={prodDetails.units}
                                                            onChange={e => setProdDetails({ ...prodDetails, units: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={prodDetails.unitPrice}
                                                            onChange={e => setProdDetails({ ...prodDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
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
                                                    <Form.Group as={Col} sm={3} className="mb-3">
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
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>Description <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            as="textarea"
                                                            type="text"
                                                            placeholder=""
                                                            rows={5}
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
                                                onClick={updateProductById}
                                            >
                                                <BsFillPencilFill /> Update Product
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