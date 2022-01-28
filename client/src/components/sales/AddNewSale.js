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
    Navbar,
    Container,
    Table,
} from 'react-bootstrap';

import { homeContainer, navBarStyles, navBarBrand, spanIms, addNewStyleHeader } from '../../css/styles';

export default function AddNewSale() {
    const history = useHistory();
    const [prodList, setProdList] = useState([]);
    const [cxList, setCxList] = useState([]);
    const [addedCx, setAddedCx] = useState([]);
    const [notif, setNotif] = useState({ status: false });
    const [amountDue, setAmountDue] = useState(0);
    const [addedSaleList, setAddedSaleList] = useState([]);
    const [itemDetails, setItemDetails] = useState({});

    useEffect(() => {
        axios.get('/api/inv/getAllProducts',
        { headers: { Authorization: getJwt() } })
        .then(res => {
            let prodArr = [];
            res.data.message.map((prod, index) => {
                const { productID, itemNumber, itemName, discount, stock, unitPrice, imageURL, status, description } = prod;
                prodArr.push({ key: index, prodId: productID, itemNumber: itemNumber, itemName: itemName, discount: discount, stock: stock, unitPrice: unitPrice, image: imageURL, status: status, desc: description });
            });

            return setProdList(prodArr);
        }).catch(error => setProdList({ key: error.name, text: error.message }));

        axios.get('/api/inv/getCustomerDatabase',
        { headers: { Authorization: getJwt() } })
        .then(res => {
            let cxArr = [];
            res.data.message.map((cx, index) => {
                const { customerID, fullName, gender, email, mobile, phone2, address, address2, city, district } = cx;
                cxArr.push({ key: index, customerId: customerID, fullName: fullName, gender: gender, email: email, mobile: mobile, phone2: phone2, address: address, address2: address2, city: city, district: district })
            });

            return setCxList(cxArr);

        }).catch(error => setCxList({ key: error.name, text: error.message }));
    }, []);

    const handleCustomerNameChange = (e) => {
        cxList.find(x => {
            if (x.fullName === e.target.value) {
                setAddedCx({ customerId: x.customerId, fullName: x.fullName });
            };
        });
    };

    const handleItemNameChange = (e) => {
        prodList.find(x => {
            if (x.itemName === e.target.value) {
                setItemDetails({ itemName: x.itemName, itemNumber: x.itemNumber, unitPrice: x.unitPrice, stock: x.stock });
            };
        });

        if (e.target.value === "") {
            setItemDetails({ itemNumber: '', unitPrice: '', stock: '' });
        };
    };

    const handleAddToList = () => {
        const { itemName, itemNumber, unitPrice, qty, discount } = itemDetails;
        let tempDisc;

        if (itemName !== undefined && qty !== undefined) {
            let totalPrice = unitPrice * qty;
            let partAmountDue = totalPrice + amountDue;

            if (discount === undefined) {
                tempDisc = 0;
            } else {
                tempDisc = discount;
            };

            setAmountDue(partAmountDue);
            setAddedSaleList([...addedSaleList, { customerName: addedCx.fullName, customerId: addedCx.customerId, itemName: itemName, itemNumber: itemNumber, unitPrice: unitPrice, qty: qty, discount: tempDisc, saleDate: new Date() }]);
            
            resetForm();
        };
    };

    const handleRemoveSale = (e, itemName, deductAmount) => {
        e.preventDefault();
        
        setAddedSaleList(addedSaleList.filter(item => item.itemName !== itemName));
        setAmountDue(amountDue - deductAmount);
    };

    const submitOrderSale = () => {
        console.log(addedSaleList);
        axios.post('/api/inv/createSale', addedSaleList,
        { headers: { Authorization: getJwt() } })
        .then(() => {
            setNotif({ status: true, variant: 'success', message: 'This Order Sale was already submitted!' });
        })
        .catch(() => {
            setNotif({ status: true, variant: 'danger', message: 'Something is wrong going on in the backend.' });
        });
    };
    
    const printOrderSlip = () => {
        let orderSlip = document.getElementById("orderSlip").outerHTML;
        let x = window.open('', '', 'height=700, width=700');

        x.document.write('<html>');
        x.document.write('<body> <br>');
        x.document.write(orderSlip);
        x.document.write('</body></html>');
        x.document.close();
        x.print();

        history.push('/home');
    };

    const resetForm = () => {
        document.getElementById("addNewSaleForm").reset();
        setItemDetails({ itemName: '', itemNumber: '', unitPrice: '', stock: '' });
    };

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
                    <Col sm={5}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={addNewStyleHeader}>
                                            Add New Sale 
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Customer Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="customerName"
                                                            onChange={e => handleCustomerNameChange(e)}
                                                        />
                                                        <datalist id="customerName">
                                                            {cxList.length >= 1 ? cxList.map((cx, index) => {
                                                                const { fullName } = cx;
                                                                return <option key={index} value={fullName} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Form id="addNewSaleForm">
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label>Item Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list='itemName'
                                                            onChange={e => handleItemNameChange(e)}
                                                        />
                                                        <datalist id="itemName">
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                const { itemName } = prod;
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
                                                            value={itemDetails.itemNumber}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Quantity</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            onChange={e => setItemDetails({ ...itemDetails, qty: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Discount %</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            onChange={e => setItemDetails({ ...itemDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Unit Price</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={itemDetails.unitPrice}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label>Total Stock</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={itemDetails.stock}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                            <Button
                                                type='submit'
                                                variant="primary"
                                                size="sm"
                                                style={{ marginRight: '5px', float: 'left' }}
                                                onClick={handleAddToList}
                                            >
                                                Add Sale
                                            </Button>
                                            <Link to="/home"><Button size="sm" variant="outline-secondary">Cancel</Button></Link>
                                        </Card.Body>
                                    </Card>
                                </CardGroup>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <p>This page is not yet approved for display.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                    <Col sm={5}>
                        <CardGroup>
                            <Card>
                                <Card.Header style={{ backgroundColor: '#2980B9', color: 'white' }}>Order Slip</Card.Header>
                                <Card.Body id="orderSlip">
                                    <h5 style={{ textAlign: 'center' }}>ExpertCare Pharmacy - Order Slip</h5>
                                    <p style={{ textAlign: 'center' }}>Tudtud, Nasipit Road, Talamban, Cebu City, Philippines 6000</p>
                                    <br />
                                    <p>Customer Name: <b>{addedCx.fullName}</b></p>
                                    <p>Ordered Date: <b>{moment(new Date()).format('MM/DD/YY h:mm:ss a')}</b></p>
                                    <Table striped hover size="sm" id="orderSlip">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>No.</th>
                                                <th>Sale Name</th>
                                                <th>Quantity</th>
                                                <th>Unit Price</th>
                                                <th>Discount %</th>
                                                <th>Total Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {addedSaleList.length >= 1 ? addedSaleList.map((sale, index) => {
                                                const { itemName, itemNumber, qty, unitPrice, discount } = sale;
                                                return <tr key={index}>
                                                    <td><a href="#/remove" onClick={e => handleRemoveSale(e, itemName, unitPrice * qty)}>Remove</a></td>
                                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                    <td>{itemNumber + '-' + itemName}</td>
                                                    <td>{qty}</td>
                                                    <td>{'₱ ' + unitPrice}</td>
                                                    <td>{discount}</td>
                                                    <td>{'₱ ' + unitPrice * qty}</td>
                                                </tr>
                                            }): <tr><td colSpan="7" style={{ textAlign: 'center', }}>No Sale Item added yet.</td></tr>}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan={3}></th>
                                                <th>Total Amount:</th>
                                                <th colSpan={3} style={{ textAlign: 'center', color: 'red' }}>{'₱ ' + amountDue}</th>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                    <p style={{ fontWeight: 'bold', color: 'green', textAlign: 'center', fontSize: '15px' }}>{notif.message}</p>
                                </Card.Body>
                                <Card.Footer>
                                    <Button size="sm" variant="success" style={{ marginRight: '5px' }} onClick={submitOrderSale}>Submit</Button>
                                    <Button size="sm" variant="primary" onClick={printOrderSlip}>Print Slip</Button>
                                </Card.Footer>
                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
};