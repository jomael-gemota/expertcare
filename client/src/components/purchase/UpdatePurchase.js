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
    formControl,
    tblCxSalesListStyles,
    trHeaders,
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function UpdatePurchase() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [purDetails, setPurDetails] = useState({});
    const [prodList, setProdList] = useState([]);
    const [vendList, setVendList] = useState([]);
    const [purList, setPurList] = useState([]);
    const [purItemList, setPurItemList] = useState([]);
    const [vendorData, setVendorData] = useState({});

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
                    .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }));

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
        setPurDetails({ ...purDetails, itemName: e.target.value });
        
        prodList.find(x => {
            if (x.itemName === e.target.value) {
                return setPurDetails({
                    ...purDetails,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber
                });
            };
        });

        if (e.target.value === "") {
            setPurDetails({
                ...purDetails,
                itemName: '',
                itemNumber: ''
            });
        };
    };

    const handleVendorNameChange = (e) => {
        setVendorData({ ...vendorData, vendorName: e.target.value });
        let purItemListArr = []

        purList.find(x => {
            if (x.vendorName === e.target.value) {
                purItemListArr.push({
                    purchaseId: x.purchaseId,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    quantity: x.quantity,
                    unitPrice: x.unitPrice,
                    vendorId: x.vendorId,
                    vendorName: x.vendorName,
                    purchaseDate: moment(x.purchaseDate).format('YYYY-MM-DD')
                })
            };
        });

        setPurItemList(purItemListArr);
    };

    const handleUpdateVendorNameChange = (e) => {
        setPurDetails({ ...purDetails, vendorName: e.target.value });

        vendList.find(x => {
            if (x.vendorName === e.target.value) {
                return setPurDetails({
                    ...purDetails,
                    vendorName: x.vendorName,
                    vendorId: x.vendorId
                });
            };
        });

        if (e.target.value === "") {
            setPurDetails({
                ...purDetails,
                vendorName: '',
                vendorId: ''
            });
        };
    };

    const handleTransferSaleData = (item) => {

        $('tr').removeAttr('style');
        $('#'+item.purchaseId).attr("style","font-weight:bolder;border-left:2px solid #26A69A");

        setPurDetails({
            purchaseId: item.purchaseId,
            itemName: item.itemName,
            itemNumber: item.itemNumber,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vendorId: item.vendorId,
            vendorName: item.vendorName,
            purchaseDate: moment(item.purchaseDate).format('YYYY-MM-DD')
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
                <Row>
                    <Col sm={2} style={sidebarStyles}>
                        <SideBar />
                    </Col>
                    <Col>
                        <Tab.Content style={{ margin: '100px 20px 30px 50px' }}>
                            <Tab.Pane eventKey="first">
                                <Row>
                                    <Col sm={7}>
                                        <CardGroup>
                                            <Card style={cardStyles}>
                                                <Card.Header style={cardStyleHeader}>Purchased Product List</Card.Header>
                                                <Card.Body>
                                                    <Form>
                                                        <Row>
                                                            <Form.Group as={Col} className="mb-3">
                                                                <Form.Label style={formLabel}>Select Vendor Name: <Badge bg="danger">Required</Badge></Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    list="vendorName"
                                                                    value={vendorData.vendorName}
                                                                    onChange={e => handleVendorNameChange(e)}
                                                                />
                                                                <datalist id="vendorName">
                                                                    {vendList.length >= 1 ? vendList.map((vendor, index) => {
                                                                        const { vendorName } = vendor;
                                                                        return <option key={index} value={vendorName} />
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
                                                                <th>Item Number</th>
                                                                <th>Item Name</th>
                                                                <th>Unit Price</th>
                                                                <th>Qty</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {purItemList.length >= 1 ? purItemList.map((item, i) => {
                                                                return (
                                                                    <tr key={i} id={item.purchaseId}>
                                                                        <td>{item.purchaseDate}</td>
                                                                        <td>{item.itemNumber}</td>
                                                                        <td>{item.itemName}</td>
                                                                        <td>{'₱ ' + (Math.round(item.unitPrice * 100) / 100).toFixed(2)}</td>
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
                                                                    <td colSpan={6} style={{ textAlign: 'center' }}>Select <b>Vendor Name</b> above for the data to display.</td>
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
                                                    Edit Purchase
                                                </Card.Header>
                                                <Card.Body>
                                                    <Form id="updatePurForm">
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
                                                                    value={purDetails.itemName}
                                                                    onChange={e => handleItemNameChange(e)}
                                                                />
                                                                <datalist id="itemName">
                                                                    {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                        return <option key={index} value={prod.itemName} />
                                                                    }): ''}
                                                                </datalist>
                                                            </Form.Group>
                                                            <Form.Group as={Col} sm={5} className="mb-3">
                                                                <Form.Label style={formLabel}>Purchase ID <Badge bg="danger">Required</Badge></Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    disabled
                                                                    type="text"
                                                                    placeholder=""
                                                                    list="purchaseId"
                                                                    value={purDetails.purchaseId}
                                                                />
                                                                <datalist id="purchaseId">
                                                                    {purList.length >= 1 ? purList.map((pur, index) => {
                                                                        return <option key={index} value={pur.purchaseId} />
                                                                    }): ''}
                                                                </datalist>
                                                            </Form.Group>
                                                        </Row>
                                                    </Form>
                                                    <Form>
                                                        <Row className="mb-3">
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
                                                            <Form.Group as={Col} sm={3} className="mb-3">
                                                                <Form.Label style={formLabel}>Qty <Badge bg="danger">Required</Badge></Form.Label>
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
                                                            <Form.Group as={Col} sm={5} className="mb-3">
                                                                <Form.Label style={formLabel}>Vendor Name <Badge bg="danger">Required</Badge></Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    list="vendorName"
                                                                    min={0}
                                                                    value={purDetails.vendorName}
                                                                    onChange={e => handleUpdateVendorNameChange(e)}
                                                                />
                                                                <datalist id="vendorName">
                                                                    {vendList.length >= 1 ? vendList.map((vendor, index) => {
                                                                        return <option key={index} value={vendor.vendorName} />
                                                                    }): ''}
                                                                </datalist>
                                                            </Form.Group>
                                                            <Form.Group as={Col} sm={3} className="mb-3">
                                                                <Form.Label style={formLabel}>Vendor ID</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    placeholder=""
                                                                    min={0}
                                                                    disabled
                                                                    value={purDetails.vendorId}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group as={Col} className="mb-3">
                                                                <Form.Label style={formLabel}>Purchased Date</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
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