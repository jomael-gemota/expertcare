import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
    Nav,
    Navbar,
    Container,
    Alert,
    Modal,
} from 'react-bootstrap';

import { homeContainer, navBarStyles, navBarBrand, spanIms, cardStyleHeader } from '../../css/styles';

export default function UpdateSale() {
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
                res.data.message.map((prod, index) => {
                    const { productID, itemName, itemNumber, units, unitPrice, stock, discount, description } = prod;
                    prodArr.push({ productId: productID, itemName: itemName, itemNumber: itemNumber, units: units, unitPrice: unitPrice, stock: stock, discount: discount, description: description });
                });
    
                return setProdList(prodArr);
            }).catch(error => setProdList({ key: error.name, text: error.message }));
    }, [prodDetails.itemName]);

    const deleteProductById = () => {
        if (prodDetails.itemName !== undefined) {
            handleModalClose();

            axios.delete('/api/inv/deleteProdByProdId',
                { params: { id: prodDetails.productId },
                headers: { Authorization: getJwt() } })
                .then(() => setNotif({ status: true, variant: 'success', message: 'Product Deleted!' }))
                .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))

            setTimeout(function() {
                setNotif({ ...notif, status: false });
            }, 3000);

            setProdDetails({ productId: '', itemName: '', itemNumber: '', units: '', unitPrice: '', stock: '', discount: '', description: '' });
        };
    };

    const handleDeleteConfirmation = () => {
        if (prodDetails.itemName !== undefined) {
            setModalShow(true);
        };
    };

    const handleItemNameChange = (e) => {
        setProdDetails({ ...prodDetails, itemName: e.target.value });
        prodList.find(x => {
            if (x.itemName === e.target.value) {
                setProdDetails({ ...prodDetails, productId: x.productId, itemName: x.itemName, itemNumber: x.itemNumber, units: x.units, unitPrice: x.unitPrice, stock: x.stock, discount: x.discount, description: x.description });
            };
        });

        if (e.target.value === "") {
            setProdDetails({ productId: '', itemName: '', itemNumber: '', units: '', unitPrice: '', stock: '', discount: '', description: '' });
        };
    };

    const handleModalClose = () => setModalShow(false);

    const logOut = () => {
        localStorage.clear('jwt');
        history.push('/');
    };

    return (
        <div style={homeContainer}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col>
                        <Navbar fixed="top" expand="lg" style={navBarStyles}>
                            <Container fluid>
                                <Navbar.Brand href="/home" style={navBarBrand}>EXPERT CARE <span style={spanIms}>Inventory Management System Pharmacy</span></Navbar.Brand>
                                <Navbar.Toggle aria-controls="navbarScroll" />
                                <Navbar.Collapse id="navbarScroll">
                                    <Nav
                                        className="me-auto my-2 my-lg-0"
                                        style={{ maxHeight: '100px' }}
                                        navbarScroll
                                    >
                                    </Nav>
                                    <span style={{ color: 'white' }}>Welcome Staff! | <Button size="sm" variant="danger" onClick={logOut}>Log Out</Button></span>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </Col>
                </Row>
                <br />
                <br />
                <Row style={{ padding: '3%' }}>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Inventory</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second" disabled>Services</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={6}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={modalShow} onHide={handleModalClose} animation={true}>
                                    <Modal.Header closeButton>
                                        <Modal.Title><h5>Delete Confirmation</h5></Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Do you really want to delete this product?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={handleModalClose}>Cancel</Button>
                                        <Button variant="danger" size="sm" onClick={() => deleteProductById()}>Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={cardStyleHeader}>
                                            Remove Product 
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Alert variant={notif.variant} show={notif.status} onClose={() => setNotif({ status: false })} dismissible>{notif.message}</Alert>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Item Name<span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text:"
                                                            placeholder="Select Item Name"
                                                            list="itemName"
                                                            value={prodDetails.itemName}
                                                            onChange={e => handleItemNameChange(e)}
                                                        />
                                                        <datalist id="itemName">
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                const { itemName  } = prod;
                                                                return <option key={index} value={itemName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Item Number</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={prodDetails.itemNumber}
                                                            onChange={e => setProdDetails({ ...prodDetails, itemNumber: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form id="updateProductForm">
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Units</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={prodDetails.units}
                                                            onChange={e => setProdDetails({ ...prodDetails, units: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Unit Price</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={prodDetails.unitPrice}
                                                            onChange={e => setProdDetails({ ...prodDetails, unitPrice: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Stock</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={prodDetails.stock}
                                                            onChange={e => setProdDetails({ ...prodDetails, stock: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Discount %</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            min={0}
                                                            value={prodDetails.discount}
                                                            onChange={e => setProdDetails({ ...prodDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={6} className="mb-3">
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control
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
                                            <Button
                                                type='submit'
                                                variant="danger"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={handleDeleteConfirmation}
                                            >
                                                Delete
                                            </Button>
                                            <Link to="/home"><Button size="sm" variant="outline-secondary">Go Back</Button></Link>
                                        </Card.Body>
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