import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
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
    Table,
} from 'react-bootstrap';
import {
    BsPencilFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs';
import { BiTransfer } from 'react-icons/bi';
import { FaInfo } from 'react-icons/fa';

import {
    homeContainer,
    cardStyleHeader,
    formLabel,
    sidebarStyles,
    cardStyles,
    tblCxSalesListStyles,
    formControl,
    trHeaders,
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function UpdateSale() {
    const history = useHistory();
    const [salesList, setSalesList] = useState([]);
    const [saleDetails, setSaleDetails] = useState([]);
    const [cxList, setCxList] = useState([]);
    const [prodList, setProdList] = useState([]);
    const [notif, setNotif] = useState({ status: false });
    const [cxSalesList, setCxSalesList] = useState([]);

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
                .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }));

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

            setTimeout(function() {
                history.push('/home');
            }, 1500);
        } else setNotif({ status: true, variant: 'warning', message: 'No item being transferred yet.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleCustomerNameChange = (e) => {
        setSaleDetails({ ...saleDetails, customerName: e.target.value });
        let cxSalesListArr = [];

        salesList.find(x => {
            if (x.customerName === e.target.value) {
                cxSalesListArr.push({
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
        
        setCxSalesList(cxSalesListArr);

        if (e.target.value === "") {
            setSaleDetails({
                customerName: '',
                saleId: '',
                itemName: '',
                itemNumber: '',
                saleDate: '',
                discount: '',
                quantity: '',
                unitPrice: ''
            });
        };
    };

    const handleTransferSaleData = (item) => {

        $('tr').removeAttr('style');
        $('#'+item.saleId).attr("style","font-weight:bolder;border-left:2px solid #26A69A");

        setSaleDetails({
            saleId: item.saleId,
            customerName: item.customerName,
            itemName: item.itemName,
            itemNumber: item.itemNumber,
            saleDate: moment(item.saleDate).format('MM/DD/YYYY'),
            discount: item.discount,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        });
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
                <Row>
                    <Col sm={2} style={ sidebarStyles }>
                        <SideBar />
                    </Col>
                    <Col>
                        <Tab.Content style={{ margin: '100px 30px 30px 50px' }}>
                            <Tab.Pane eventKey="first">
                                <Row>
                                    <Col sm={7}>
                                        <CardGroup>
                                            <Card style={cardStyles}>
                                                <Card.Header style={cardStyleHeader}>Customer Sales List</Card.Header>
                                                <Card.Body>
                                                    <Form>
                                                        <Row>
                                                            <Form.Group as={Col} className="mb-3">
                                                                <Form.Label style={formLabel}>Select Customer Name: <Badge bg="danger">Required</Badge></Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    list="customerName"
                                                                    disabled={salesList.length > 0 ? false : true}
                                                                    placeholder={salesList.length > 0 ? "" : "Loading..."}
                                                                    value={saleDetails.customerName}
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
                                                    <hr style={{ border: '1px solid grey' }} />
                                                    <Table responsive hover striped style={tblCxSalesListStyles}>
                                                        <thead style={trHeaders}>
                                                            <tr>
                                                                <th>Ordered Date</th>
                                                                <th>Customer Name</th>
                                                                <th>Item Number</th>
                                                                <th>Item Name</th>
                                                                <th>Qty</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cxSalesList.length >= 1 ? cxSalesList.map((item, i) => {
                                                                return (
                                                                    <tr key={i} id={item.saleId}>
                                                                        <td>{item.saleDate}</td>
                                                                        <td>{item.customerName}</td>
                                                                        <td>{item.itemNumber}</td>
                                                                        <td>{item.itemName}</td>
                                                                        <td style={{ textAlign: 'center', fontWeight: 'bolder' }}>{item.quantity}</td>
                                                                        <td style={{ textAlign: 'center' }}>
                                                                            <Button
                                                                                variant='warning'
                                                                                size='sm'
                                                                                onClick={() => handleTransferSaleData(item)}
                                                                            >
                                                                                <BiTransfer />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }): <tr>
                                                                    <td colSpan={6} style={{ textAlign: 'center' }}>Select <b>Customer Name</b> above for the data to display.</td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Card.Body>
                                            </Card>
                                        </CardGroup>
                                    </Col>
                                    <Col>
                                        <CardGroup>
                                            <Card style={cardStyles}>
                                                <Card.Header style={cardStyleHeader}>
                                                    Edit Sale 
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
                                                                <Form.Label style={formLabel}>Customer Name</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    list="customerName"
                                                                    disabled
                                                                    value={saleDetails.customerName}
                                                                    onChange={e => handleCustomerNameChange(e)}
                                                                />
                                                                <datalist id="customerName">
                                                                    {cxList.length >= 1 ? cxList.map((cx, index) => {
                                                                        const { fullName } = cx;
                                                                        return <option key={index} value={fullName} />
                                                                    }): ''}
                                                                </datalist>
                                                            </Form.Group>
                                                            <Form.Group as={Col} sm={3} className="mb-3">
                                                                <Form.Label style={formLabel}>Sale ID</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    disabled
                                                                    type="text"
                                                                    list="saleId"
                                                                    value={saleDetails.saleId}
                                                                    onChange={e => setSaleDetails({ ...saleDetails, saleId: e.target.value })}
                                                                />
                                                                <datalist id="saleId">
                                                                    {salesList.length >= 1 ? salesList.map((sale, index) => {
                                                                        const { saleId  } = sale;
                                                                        return <option key={index} value={saleId} />
                                                                    }): ''}
                                                                </datalist>
                                                            </Form.Group>
                                                        </Row>
                                                    </Form>
                                                    <Form id="updateSaleForm">
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} className="mb-3">
                                                                <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge></Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    disabled={prodList.length > 0 ? false : true}
                                                                    placeholder={prodList.length > 0 ? "" : "Loading..."}
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
                                                                <Form.Label style={formLabel}>Item Number</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    placeholder=""
                                                                    value={saleDetails.itemNumber}
                                                                    disabled
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} sm={6} className="mb-3">
                                                                <Form.Label style={formLabel}>Qty <Badge bg="danger">Required</Badge></Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="number"
                                                                    placeholder=""
                                                                    min={0}
                                                                    value={saleDetails.quantity}
                                                                    onChange={e => setSaleDetails({ ...saleDetails, quantity: e.target.value })}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group as={Col} sm={6} className="mb-3">
                                                                <Form.Label style={formLabel}>Unit Price</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="number"
                                                                    placeholder=""
                                                                    disabled
                                                                    value={(Math.round(saleDetails.unitPrice * 100) / 100).toFixed(2)}
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                        <Row>
                                                            <Form.Group as={Col} sm={6} className="mb-3">
                                                                <Form.Label style={formLabel}>Disc. % <Badge bg="info">Optional</Badge></Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="number"
                                                                    placeholder=""
                                                                    min={0}
                                                                    value={saleDetails.discount}
                                                                    onChange={e => setSaleDetails({ ...saleDetails, discount: e.target.value })}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group as={Col} sm={6} className="mb-3">
                                                                <Form.Label style={formLabel}>Sale Date</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    placeholder=""
                                                                    disabled
                                                                    value={saleDetails.saleDate}
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                        <Alert variant='info' style={formControl}>
                                                                    <b>Total Price:</b> ₱ {saleDetails.unitPrice === undefined
                                                                    ? 0
                                                                    : (Math.round((saleDetails.quantity * saleDetails.unitPrice) * 100) / 100).toFixed(2)}
                                                        </Alert>
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
                                    </Col>
                                </Row>
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