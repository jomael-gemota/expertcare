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
    Modal,
    Badge,
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

export default function RemoveProduct() {
    const history = useHistory();
    const [prodList, setProdList] = useState([]);
    const [prodDetails, setProdDetails] = useState([]);
    const [notif, setNotif] = useState({ status: false });
    const [modalShow, setModalShow] = useState(false);

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

    const deleteProductById = () => {
        if (prodDetails.productId !== undefined) {
            handleModalClose();

            axios.delete('/api/inv/deleteProdByProdId',
                { params: { id: prodDetails.productId },
                headers: { Authorization: getJwt() } })
                .then(() => setNotif({ status: true, variant: 'success', message: 'Product Deleted!' }))
                .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }))

            setTimeout(function() {
                setNotif({ ...notif, status: false });
                history.push('/home');
            }, 2000);

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
        } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
    };

    const handleDeleteConfirmation = () => {
        let isProdExist = false;
        prodList.find(x => { if (x.itemName === prodDetails.itemName) isProdExist = true });

        if (isProdExist === true) {
            if (prodDetails.itemName !== undefined) {
                setModalShow(true);
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

    const handleModalClose = () => setModalShow(false);

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
                                        <Alert variant='danger'><b>Note:</b> Once you delete a product, there is no going back. Please be certain.</Alert>
                                        Do you really want to delete this product?
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={handleModalClose}><BsBackspaceReverseFill /> Cancel</Button>
                                        <Button variant="danger" size="sm" onClick={() => deleteProductById()}><BsTrashFill /> Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                                <CardGroup>
                                    <Card style={cardStyles}>
                                        <Card.Header style={cardStyleHeader}>
                                            Remove Product 
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
                                                            type="text"
                                                            disabled
                                                            placeholder=""
                                                            value={prodDetails.productId}
                                                            onChange={e => setProdDetails({ ...prodDetails, productId: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={4} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Number</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={prodDetails.itemNumber}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemNumber: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Units</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={prodDetails.units}
                                                            onChange={e => setProdDetails({ ...prodDetails, units: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={(Math.round(prodDetails.unitPrice * 100) / 100).toFixed(2)}
                                                            onChange={e => setProdDetails({ ...prodDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Stock</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={prodDetails.stock}
                                                            onChange={e => setProdDetails({ ...prodDetails, stock: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Disc. %</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={prodDetails.discount}
                                                            onChange={e => setProdDetails({ ...prodDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label style={formLabel}>Description</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            as="textarea"
                                                            type="text"
                                                            placeholder=""
                                                            disabled
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
                                                variant="danger"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={handleDeleteConfirmation}
                                            >
                                                <BsTrashFill /> Delete Product
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