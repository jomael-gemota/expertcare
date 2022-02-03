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
    Alert,
    Badge,
} from 'react-bootstrap';

import {
    homeContainer,
    navBarStyles,
    navBarBrand,
    spanIms,
    cardStyleHeader,
    formLabel
} from '../../css/styles';

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
                    prodArr.push({
                        prodId: prod.productID,
                        itemNumber: prod.itemNumber,
                        itemName: prod.itemName,
                        discount: prod.discount,
                        stock: prod.stock,
                        unitPrice: prod.unitPrice,
                        image: prod.imageURL,
                        status: prod.status,
                        desc: prod.description
                    });
                });

                return setProdList(prodArr);

            }).catch(error => setProdList({ key: error.name, text: error.message }));

        axios.get('/api/inv/getCustomerDatabase',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let cxArr = [];
                res.data.message.map(cx => {
                    cxArr.push({
                        customerId: cx.customerID,
                        fullName: cx.fullName,
                        gender: cx.gender,
                        email: cx.email,
                        mobile: cx.mobile,
                        phone2: cx.phone2,
                        address: cx.address,
                        address2: cx.address2,
                        city: cx.city,
                        district: cx.district
                    });
                });

                return setCxList(cxArr);

            }).catch(error => setCxList({ key: error.name, text: error.message }));
    }, []);

    const handleCustomerNameChange = (e) => {
        cxList.find(x => {
            if (x.fullName === e.target.value) {
                setAddedCx({
                    customerId: x.customerId,
                    fullName: x.fullName
                });
            };
        });
    };

    const handleItemNameChange = (e) => {
        prodList.find(x => {
            if (x.itemName === e.target.value) {
                setItemDetails({
                    productId: x.prodId,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    unitPrice: x.unitPrice,
                    stock: x.stock
                });
            };
        });

        if (e.target.value === "") {
            setItemDetails({
                itemNumber: '',
                unitPrice: '',
                stock: ''
            });
        };
    };

    const handleAddToList = () => {
        const {
            productId,
            itemName,
            itemNumber,
            unitPrice,
            qty,
            discount,
            stock
        } = itemDetails;
        let tempDisc;

        if (itemName !== undefined && qty !== undefined) {
            let totalPrice = unitPrice * qty;
            let partAmountDue = totalPrice + amountDue;

            if (discount === undefined) {
                tempDisc = 0;
            } else tempDisc = discount;

            setAmountDue(partAmountDue);
            setAddedSaleList([
                ...addedSaleList,
                {
                    productId: productId,
                    stock: stock,
                    customerName: addedCx.fullName,
                    customerId: addedCx.customerId,
                    itemName: itemName,
                    itemNumber: itemNumber,
                    unitPrice: unitPrice,
                    qty: qty,
                    discount: tempDisc,
                    saleDate: new Date()
                }
            ]);
            
            resetForm();
        };
    };

    const handleQtyChange = (e) => {
        const currStock = Number(itemDetails.stock || 0);
        const currValue = Number(e.target.value || 0)
        const currQty = Number(itemDetails.qty || 0)
        const qtyDiff = Math.abs(currQty - currValue)
        
        let presStock = currQty > currValue
            ? currStock + qtyDiff
            : currStock - qtyDiff;
        if (presStock < 0) {
            return
        }
        setItemDetails({ ...itemDetails, qty: currValue, stock: presStock });
    };

    const handleRemoveSale = (e, itemName, deductAmount) => {
        e.preventDefault();
        
        setAddedSaleList(addedSaleList.filter(item => item.itemName !== itemName));
        setAmountDue(amountDue - deductAmount);
    };

    const submitOrderSale = () => {
        axios.post('/api/inv/createSale', addedSaleList,
            { headers: { Authorization: getJwt() } })
            .then(() => {
                setNotif({
                    status: true,
                    variant: 'success',
                    message: 'Sale Submitted!'
                });

                addedSaleList.map(sale => {
                    let stockObj = {};

                    stockObj.stock = sale.stock;
                    stockObj.productId = sale.productId;

                    return axios.patch('/api/inv/updateStockByProdId', stockObj,
                        { headers: { Authorization: getJwt() } })
                        .then()
                        .catch(() => setNotif({
                            status: true,
                            variant: 'danger',
                            message: 'Total Stock was not updated.'
                        }))
                })
            })
            .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }))

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);

        printOrderSlip();
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
        setItemDetails({
            itemName: '',
            itemNumber: '',
            unitPrice: '',
            stock: ''
        });
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
                                <Navbar.Brand href="/home" style={navBarBrand}>
                                    EXPERT CARE <span style={spanIms}>Inventory Management System Pharmacy</span>
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="navbarScroll" />
                                <Navbar.Collapse id="navbarScroll">
                                    <Nav
                                        className="me-auto my-2 my-lg-0"
                                        style={{ maxHeight: '100px' }}
                                        navbarScroll
                                    >
                                    </Nav>
                                    <span style={{ color: 'white' }}>
                                        Welcome Staff! | <Button size="sm" variant="danger" onClick={logOut}>Log Out</Button>
                                    </span>
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
                                        <Card.Header style={cardStyleHeader}>
                                            Add New Sale 
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Customer Name <Badge bg="danger">Required</Badge></Form.Label>
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
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge></Form.Label>
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
                                                        <Form.Label style={formLabel}>Item Number  <Badge bg="secondary">Generated</Badge></Form.Label>
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
                                                        <Form.Label style={formLabel}>Quantity <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={itemDetails.qty}
                                                            disabled={itemDetails.stock > 0 ? false : true}
                                                            onChange={e => handleQtyChange(e)}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Disc. % <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            onChange={e => setItemDetails({ ...itemDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={itemDetails.unitPrice}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Total Stock  <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={itemDetails.stock}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form>
                                        </Card.Body>
                                        <Card.Footer>
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
                                        </Card.Footer>
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
                                    <Alert
                                        variant={notif.variant}
                                        show={notif.status}
                                        onClose={() => setNotif({ status: false })}
                                        dismissible
                                    >
                                        {notif.message}
                                    </Alert>
                                    <h5 style={{ textAlign: 'center' }}>Expert Care Pharmacy</h5>
                                    <p style={{ textAlign: 'center'}}>Tudtud, Nasipit Road, Talamban, Cebu City, Philippines 6000</p>
                                    <h6 style={{ textAlign: 'center', fontWeight: 'bolder' }}>Order Slip</h6>
                                    <br />
                                    <p><b style={formLabel}>Customer Name:</b> {addedCx.fullName}</p>
                                    <p><b style={formLabel}>Ordered Date:</b> {moment(new Date()).format('MM/DD/YY h:mm:ss a')}</p>
                                    <Table
                                        striped
                                        hover
                                        size="sm"
                                        id="orderSlip"
                                        style={{ marginBottom: '35px' }}
                                    >
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>No.</th>
                                                <th>Item No./Name</th>
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
                                                    <td>
                                                        <a href="#/remove" onClick={e => handleRemoveSale(e, itemName, unitPrice * qty)}>Remove</a>
                                                    </td>
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
                                </Card.Body>
                                <Card.Footer>
                                    <Button
                                        size="sm"
                                        variant="success"
                                        style={{ marginRight: '5px' }}
                                        onClick={submitOrderSale}
                                    >
                                        Submit & Print
                                    </Button>
                                    <Link to="/home"><Button size="sm" variant="outline-secondary">Go Back</Button></Link>
                                </Card.Footer>
                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
};