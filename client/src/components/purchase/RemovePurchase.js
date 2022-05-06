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
    Modal,
    Badge,
    Table,
} from 'react-bootstrap';
import {
    BsTrashFill,
    BsFillArrowLeftCircleFill,
    BsFillExclamationCircleFill,
    BsBackspaceReverseFill
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

export default function RemovePurchase() {
    const history = useHistory();
    const [notif, setNotif] = useState({ status: false });
    const [purDetails, setPurDetails] = useState({});
    const [purList, setPurList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [vendList, setVendList] = useState([]);
    const [purItemList, setPurItemList] = useState([]);
    const [vendorData, setVendorData] = useState({});

    useEffect(() => {
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

        axios.get('/api/inv/getAllVendors',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let vendArr = [];
                res.data.message.map(vendor => {
                    return vendArr.push({ vendorId: vendor.vendorID, vendorName: vendor.fullName });
                });

                return setVendList(vendArr);

            }).catch(error => setVendList({ key: error.name, text: error.message }));
    }, [purDetails.purchaseId]);

    const deletePurchaseById = () => {
        if (purDetails.purchaseId !== undefined) {
            if (purDetails.purchaseId !== "") {
                handleModalClose();

                axios.delete('/api/inv/deletePurchaseById',
                    { params: { id: purDetails.purchaseId },
                    headers: { Authorization: getJwt() } })
                    .then(() => {
                        setNotif({ status: true, variant: 'success', message: 'Purchase Deleted!' });
                        resetForm();
                    })
                    .catch(() => setNotif({ status: true, variant: 'warning', message: 'Something is wrong.' }))

                setTimeout(function() {
                    history.push('/home');
                }, 1500);
            };
        };

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };

    const handleDeleteConfirmation = () => {
        console.log(purDetails.purchaseId);
        if (purDetails.purchaseId !== undefined) {
            if (purDetails.purchaseId !== "") {
                setModalShow(true);
            } else setNotif({ status: true, variant: 'warning', message: 'Fill-up all the required fields.' });
        } else setNotif({ status: true, variant: 'warning', message: 'No item being transferred yet.' });
        
        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 3000);
    };

    const handlePurchaseIDChange = (e) => {
        let objPurDetails = {};
        setPurDetails({ ...purDetails, purchaseId: e.target.value });

        purList.find(x => {
            if (x.purchaseId === Number(e.target.value)) {
                objPurDetails = {
                    purchaseId: x.purchaseId,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    quantity: x.quantity,
                    unitPrice: x.unitPrice,
                    vendorId: x.vendorId,
                    vendorName: x.vendorName,
                    purchaseDate: moment(x.purchaseDate).format('YYYY-MM-DD')
                };
            };

            return setPurDetails(objPurDetails);
        });

        if (e.target.value === "") {
            setPurDetails({
                itemName: '',
                itemNumber: '',
                quantity: '',
                unitPrice: '',
                vendorId: '',
                vendorName: '',
                purchaseDate: ''
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
        document.getElementById("removePurForm").reset();
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
                    <Col sm={2} style={sidebarStyles}>
                        <SideBar />
                    </Col>
                    <Col>
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
                                        <Alert variant='danger'><b>Note:</b> Once you delete a purchase, there is no going back. Please be certain.</Alert>
                                        Do you really want to delete this purchase?
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={handleModalClose}><BsBackspaceReverseFill /> Cancel</Button>
                                        <Button variant="danger" size="sm" onClick={() => deletePurchaseById()}><BsTrashFill /> Remove</Button>
                                    </Modal.Footer>
                                </Modal>
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
                                                                    disabled={vendList.length > 0 ? false : true}
                                                                    placeholder={vendList.length > 0 ? "" : "Loading..."}
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
                                                <Card.Header style={cardStyleHeader}>Remove Purchase</Card.Header>
                                                <Card.Body>
                                                    <Form id="removePurForm">
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
                                                                <Form.Label style={formLabel}>Item Name</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    placeholder=""
                                                                    disabled
                                                                    value={purDetails.itemName}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group as={Col} sm={3} className="mb-3">
                                                                <Form.Label style={formLabel}>Purchase ID</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    disabled
                                                                    placeholder=""
                                                                    list="purchaseId"
                                                                    value={purDetails.purchaseId}
                                                                    onChange={e => handlePurchaseIDChange(e)}
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
                                                                <Form.Label style={formLabel}>Qty</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="number"
                                                                    placeholder=""
                                                                    disabled
                                                                    min={0}
                                                                    value={purDetails.quantity}
                                                                />
                                                            </Form.Group>
                                                            <Form.Group as={Col} sm={3} className="mb-3">
                                                                <Form.Label style={formLabel}>Unit Price</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="number"
                                                                    placeholder=""
                                                                    disabled
                                                                    min={0}
                                                                    value={(Math.round(purDetails.unitPrice * 100) / 100).toFixed(2)}
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                        <hr />
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} sm={6} className="mb-3">
                                                                <Form.Label style={formLabel}>Vendor Name</Form.Label>
                                                                <Form.Control
                                                                    style={formControl}
                                                                    type="text"
                                                                    placeholder=""
                                                                    disabled
                                                                    min={0}
                                                                    value={purDetails.vendorName}
                                                                />
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
                                                            <Form.Group as={Col} sm={3} className="mb-3">
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
                                                        variant="danger"
                                                        size="sm"
                                                        style={{ marginRight: '5px', float: 'left' }}
                                                        onClick={handleDeleteConfirmation}
                                                    >
                                                        <BsTrashFill /> Delete Purchase
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