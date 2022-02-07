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
    BsCartFill,
    BsPencilFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs';

import {
    homeContainer,
    cardStyleHeader,
    formLabel,
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';

export default function UpdateSale() {
    const history = useHistory();
    const [salesList, setSalesList] = useState([]);
    const [saleDetails, setSaleDetails] = useState([]);
    const [cxList, setCxList] = useState([]);
    const [prodList, setProdList] = useState([]);
    const [notif, setNotif] = useState({ status: false });

    useEffect(() => {
        axios.get('/api/inv/getAllSales',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let salesArr = [];
                res.data.message.map(sale => {
                    return salesArr.push({
                        saleId: sale.saleID,
                        customerName: sale.customerName,
                        itemName: sale.itemName,
                        itemNumber: sale.itemNumber,
                        saleDate: sale.saleDate,
                        discount: sale.discount,
                        quantity: sale.quantity,
                        unitPrice: sale.unitPrice
                    });
                });

                return setSalesList(salesArr);

            }).catch(error => setSalesList({ key: error.name, text: error.message }));

        axios.get('/api/inv/getCustomerDatabase',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let cxArr = [];
                res.data.message.map(cx => {
                    return cxArr.push({
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
                        image: prod.imageURL,
                        status: prod.status,
                        desc: prod.description
                    });
                });
    
                return setProdList(prodArr);

            }).catch(error => setProdList({ key: error.name, text: error.message }));
    }, [saleDetails.saleId]);

    const updateSaleBySaleId = () => {
        if (saleDetails.saleId !== undefined) {
            axios.patch('/api/inv/updateSaleBySaleId', saleDetails,
                { headers: { Authorization: getJwt() } })
                .then(() => setNotif({ status: true, variant: 'success', message: 'Sale Updated!' }))
                .catch(() => setNotif({ status: true, variant: 'danger', message: 'Something is wrong.' }));

            setSaleDetails({
                saleId: '',
                customerName: '',
                itemName: '',
                itemNumber: '',
                saleDate: '',
                discount: '',
                quantity: '',
                unitPrice: ''
            });
        } else setNotif({ status: true, variant: 'danger', message: 'Fill-up all the required fields.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 3000);
    };

    const handleSaleIdChange = (e) => {
        setSaleDetails({ ...saleDetails, saleId: e.target.value });
        salesList.find(x => {
            if (x.saleId === Number(e.target.value)) {
                setSaleDetails({
                    saleId: x.saleId,
                    customerName: x.customerName,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    saleDate: moment(x.saleDate).format('MM/DD/YYYY'),
                    discount: x.discount,
                    quantity: x.quantity,
                    unitPrice: x.unitPrice
                });
            };
        });

        if (e.target.value === "") {
            setSaleDetails({
                customerName: '',
                itemName: '',
                itemNumber: '',
                saleDate: '',
                discount: '',
                quantity: '',
                unitPrice: ''
            });
        };
    };

    const handleItemNameChange = (e) => {
        setSaleDetails({ ...saleDetails, itemName: e.target.value });
        
        prodList.find(x => {
            if (x.itemName === e.target.value) {
                setSaleDetails({
                    ...saleDetails,
                    itemName: e.target.value,
                    itemNumber: x.itemNumber,
                    unitPrice: x.unitPrice,
                    stock: x.stock
                });
            };
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
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={cardStyleHeader}>
                                            <BsCartFill /> Edit Sale 
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
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
                                                        <Form.Label style={formLabel}>Sale ID <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="saleId"
                                                            value={saleDetails.saleId}
                                                            onChange={e => handleSaleIdChange(e)}
                                                        />
                                                        <datalist id="saleId">
                                                            {salesList.length >= 1 ? salesList.map((sale, index) => {
                                                                const { saleId  } = sale;
                                                                return <option key={index} value={saleId} />
                                                            }): ''}
                                                        </datalist>
                                                    </Form.Group>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Customer Name <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list="customerName"
                                                            disabled
                                                            value={saleDetails.customerName}
                                                            onChange={e => setSaleDetails({ ...saleDetails, customerName: e.target.value })}
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
                                            <Form id="updateSaleForm">
                                                <hr />
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            list='itemName'
                                                            value={saleDetails.itemName}
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
                                                        <Form.Label style={formLabel}>Item Number <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            value={saleDetails.itemNumber}
                                                            disabled
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
                                                            value={saleDetails.quantity}
                                                            onChange={e => setSaleDetails({ ...saleDetails, quantity: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Disc. % <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={saleDetails.discount}
                                                            onChange={e => setSaleDetails({ ...saleDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={saleDetails.unitPrice}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Sale Date <Badge bg="secondary">Generated</Badge></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={saleDetails.saleDate}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <p><span style={formLabel}>Total Price: </span><b style={{ color: 'red' }}>
                                                         ₱ {saleDetails.unitPrice === undefined
                                                            ? 0
                                                            : saleDetails.quantity * saleDetails.unitPrice}</b></p>
                                            </Form>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button
                                                    type='submit'
                                                    variant="success"
                                                    size="sm"
                                                    style={{ marginRight: '5px', float: 'left' }}
                                                    onClick={updateSaleBySaleId}
                                                >
                                                    <BsPencilFill /> Update Sale
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