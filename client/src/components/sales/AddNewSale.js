import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import getJwt from '../../helper/getJwt';
import printJS from 'print-js';
import {
    Card,
    CardGroup,
    Form,
    Button,
    Tab,
    Row,
    Col,
    Table,
    Alert,
    Badge,
    ToggleButton,
    ButtonGroup,
    Modal,
} from 'react-bootstrap';
import { MdSend } from 'react-icons/md';
import { FaMinusCircle, FaPencilAlt } from 'react-icons/fa';
import {
    BsPencilFill,
    BsPencilSquare,
    BsPlusCircleFill,
    BsFillPrinterFill,
    BsBackspaceReverseFill,
    BsFillArrowLeftCircleFill,
} from 'react-icons/bs'
import { FaInfo } from 'react-icons/fa';

import {
    homeContainer,
    cardStyleHeader,
    formLabel,
    orderSlipStyles,
    sidebarStyles,
    formControl,
    cardStyles,
} from '../../css/styles';

import NavigationBar from '../navigations/NavigationBar';
import SideBar from '../navigations/SideBar';

export default function AddNewSale() {
    const history = useHistory();
    const [prodList, setProdList] = useState([]);
    const [cxList, setCxList] = useState([]);
    const [addedCx, setAddedCx] = useState([]);
    const [notif, setNotif] = useState({ status: false });
    const [notifForm, setNotifForm] = useState({ status: false });
    const [notifModal, setNotifModal] = useState({ status: false });
    const [amountDue, setAmountDue] = useState(0);
    const [addedSaleList, setAddedSaleList] = useState([]);
    const [itemDetails, setItemDetails] = useState({});
    const [procDate, setProcDate] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [osItemDetails, setOsItemDetails] = useState({});
    const [showEditOrderSaleModal, setShowEditOrderSaleModal] = useState(false);

    useEffect(() => {
        axios.get('/api/inv/getAllProducts',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let prodArr = [];
                res.data.message.map((prod, index) => {
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
    }, []);

    const handleCustomerNameChange = (e) => {
        let objCxDetails = {};

        cxList.find(x => {
            if (x.fullName === e.target.value) {
                objCxDetails = {
                    customerId: x.customerId,
                    fullName: x.fullName
                };
            };

            return setAddedCx(objCxDetails);
        });
    };

    const handleItemNameChange = (e) => {
        let objProdDetails = {};

        prodList.find(x => {
            if (x.itemName === e.target.value) {
                objProdDetails = {
                    productId: x.prodId,
                    itemName: x.itemName,
                    itemNumber: x.itemNumber,
                    unitPrice: x.unitPrice,
                    stock: x.stock,
                    qty: 0
                };
            };

            return setItemDetails(objProdDetails);
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
        let tempDisc;
        const {
            productId,
            itemName,
            itemNumber,
            unitPrice,
            qty,
            discount,
            stock
        } = itemDetails;

        const saleIndex = addedSaleList.findIndex(sale => sale.productId === productId);

        if (saleIndex === -1) {
            if (addedCx.fullName !== undefined && addedCx.fullName !== '') {
                if (itemName !== undefined && itemName !== '') {
                    if (qty <= stock) {
                        if (qty !== undefined && qty !== 0 && qty !== '' && qty !== '0' && qty >= 1) {
        
                            let totalPrice = unitPrice * qty;
                            let partAmountDue = totalPrice + amountDue;
            
                            if (discount === undefined) {
                                tempDisc = 0;
                            } else tempDisc = discount;
            
                            setProcDate(moment(new Date()).format('MM/DD/YY h:mm:ss a'));
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
        
                            handleUpdateStock(productId, qty, 'add');
        
                            addedSaleList.map(sale => {
                                return (
                                    sale.customerName = addedCx.fullName,
                                    sale.customerId = addedCx.customerId
                                )
                            });
            
                            
                            resetForm();
            
                        } else setNotifForm({ status: true, variant: 'warning', message: 'Incorrect Quantity.' });
                    } else setNotifForm({ status: true, variant: 'warning', message: 'Out of Stock.' });
                } else setNotifForm({ status: true, variant: 'warning', message: 'Item Name is Required.' });
            } else setNotifForm({ status: true, variant: 'warning', message: 'Customer Name does not exist in the system.' });
        } else setNotifForm({ status: true, variant: 'warning', message: 'You have already entered the product.' });

        setTimeout(function() {
            setNotifForm({ ...notifForm, status: false });
        }, 2000);
    };

    const handleRemoveSale = (e, itemName, deductAmount, productId, qty) => {
        e.preventDefault();
        
        setAddedSaleList(addedSaleList.filter(item => item.itemName !== itemName));
        setAmountDue(amountDue - deductAmount);

        handleUpdateStock(productId, qty, 'drop');
    };

    const handleUpdateStock = (id, qty, action) => {
        const stockIndex = prodList.findIndex(i => i.prodId === id);

        if (action === 'add') {
            prodList[stockIndex].stock -= Number(qty);
        } else if (action === 'drop') {
            prodList[stockIndex].stock += Number(qty);
        };
    };

    const handleEditOrderSaleForm = (sale) => {
        setOsItemDetails(sale);
        setShowEditOrderSaleModal(true);
    };

    const handleUpdateOrderSale = () => {
        let diffQty = 0;
        let updateStockStatus = '';

        const { qty } = osItemDetails;

        if (qty !== undefined && qty !== 0 && qty !== '' && qty !== '0' && qty >= 1) {
            addedSaleList.map(sale => {
                const { productId, qty, unitPrice } = sale;
    
                if (productId === osItemDetails.productId) {
                    if (Number(qty) > Number(osItemDetails.qty)) {
                        updateStockStatus = 'drop';
                        diffQty = (qty - osItemDetails.qty);
    
                        setAmountDue(amountDue - (diffQty * unitPrice));
    
                    } else {
                        updateStockStatus = 'add';
                        diffQty = (osItemDetails.qty - qty);
    
                        setAmountDue(amountDue + (diffQty * unitPrice));
                    };
    
                    sale.qty = osItemDetails.qty;
                    handleUpdateStock(osItemDetails.productId, diffQty, updateStockStatus);
                };
            });
    
            setShowEditOrderSaleModal(false);

        } else setNotifModal({ status: true, variant: 'warning', message: 'Incorrect Quantity.' });

        setTimeout(function() {
            setNotifModal({ ...notifModal, status: false });
        }, 3000);
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

                prodList.map(prod => {
                    let stockObj = {};

                    stockObj.stock = prod.stock;
                    stockObj.productId = prod.prodId;

                    return axios.patch('/api/inv/updateStockByProdId', stockObj,
                        { headers: { Authorization: getJwt() } })
                        .then()
                        .catch(() => setNotif({
                            status: true,
                            variant: 'danger',
                            message: 'Total Stock was not updated.'
                        }))
                });

                addedSaleList.splice(0, addedSaleList.length);
                setAmountDue(0);
                setProcDate('');
                setAddedCx({
                    customerId: '',
                    fullName: ''
                });

                setTimeout(function() {
                    history.push('/home');
                }, 1500);
            })
            .catch(() => setNotif({ status: true, variant: 'warning', message: 'Order Slip is empty.' }))

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 2000);
    };
    
    const printOrderSlip = () => {
        if (isEdit === true) setIsEdit(false);
        if (addedSaleList.length >= 1) {
            setTimeout(function() {
                printJS({
                    printable: 'orderSlip',
                    type: 'html',
                    style: `h6 { text-align: center; margin-bottom: 1px; }
                        .tfTotalAmount { border-top: 1px solid #146A89 !important; }
                        .valTotalAmount { color: red; border-top: 1px solid #146A89 !important; }
                        .tbItem { text-align: center; }
                        .trHeaders { border-bottom: 1px solid #146A89 !important; }
                        table { border-collapse: collapse !important; }
                        .orderTitle { text-align: center; margin-bottom: 0px; }
                        @page { size: 5.5in 8in; margin: 5%; }`
                });
            }, 1000);
                
        } else setNotif({ status: true, variant: 'warning', message: 'Order Slip is empty.' });

        setTimeout(function() {
            setNotif({ ...notif, status: false });
        }, 3000);
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
                    <Col sm={5}>
                        <Tab.Content style={{ margin: '100px 5px 30px 50px' }}>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card style={cardStyles}>
                                        <Card.Header style={cardStyleHeader}>
                                            Add New Sale 
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Alert
                                                    variant={notifForm.variant}
                                                    show={notifForm.status}
                                                    onClose={() => setNotifForm({ status: false })}
                                                    dismissible
                                                >
                                                    <FaInfo /> {notifForm.message}
                                                </Alert>
                                                <Row>
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Customer Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            disabled={cxList.length > 0 ? false : true}
                                                            placeholder={cxList.length > 0 ? "" : "No Patient Names to show."}
                                                            list="customerName"
                                                            value={addedCx.fullName}
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
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} className="mb-3">
                                                        <Form.Label style={formLabel}>Item Name <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            disabled={prodList.length > 0 ? false : true}
                                                            placeholder={prodList.length > 0 ? "" : "No Products to show."}
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
                                                        <Form.Label style={formLabel}>Item Number</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="text"
                                                            placeholder=""
                                                            disabled
                                                            value={itemDetails.itemNumber}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Qty <Badge bg="danger">Required</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            min={0}
                                                            value={itemDetails.qty}
                                                            onChange={e => setItemDetails({ ...itemDetails, qty: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Disc. % <Badge bg="info">Optional</Badge></Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            onChange={e => setItemDetails({ ...itemDetails, discount: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Unit Price</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
                                                            type="number"
                                                            placeholder=""
                                                            disabled
                                                            value={(Math.round(itemDetails.unitPrice * 100) / 100).toFixed(2)}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} sm={3} className="mb-3">
                                                        <Form.Label style={formLabel}>Total Stock</Form.Label>
                                                        <Form.Control
                                                            style={formControl}
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
                                                <BsPlusCircleFill /> Add Sale
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
                    <Col sm={5}>
                        <CardGroup style={{ margin: '100px 20px 30px 0px' }}>
                            <Card style={{ border: '0px solid #E3F2FD' }}>
                                <Modal
                                    size="md"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                    show={showEditOrderSaleModal}
                                    onHide={() => setShowEditOrderSaleModal(false)}
                                    animation={true}
                                >
                                    <Modal.Header closeButton style={cardStyleHeader}>
                                        <Modal.Title style={{ fontSize: '18px' }}><BsPencilSquare /> Order Slip - Edit Item</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Alert
                                            variant={notifModal.variant}
                                            show={notifModal.status}
                                            onClose={() => setNotifModal({ status: false })}
                                            dismissible
                                        >
                                            <FaInfo /> {notifModal.message}
                                        </Alert>
                                        <Row>
                                            <Form.Group as={Col} className="mb-3">
                                                <Form.Label style={formLabel}>Item Number</Form.Label>
                                                <Form.Control
                                                    style={formControl}
                                                    type="text"
                                                    placeholder=""
                                                    disabled
                                                    value={`${osItemDetails.itemNumber}-${osItemDetails.itemName}`}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} sm={4} className="mb-3">
                                                <Form.Label style={formLabel}>Qty <Badge bg="danger">Required</Badge></Form.Label>
                                                <Form.Control
                                                    style={formControl}
                                                    type="number"
                                                    placeholder=""
                                                    min={0}
                                                    value={osItemDetails.qty}
                                                    onChange={e => setOsItemDetails({ ...osItemDetails, qty: e.target.value })}
                                                />
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group as={Col} className="mb-3">
                                                <Form.Label style={formLabel}>Unit Price</Form.Label>
                                                <Form.Control
                                                    style={formControl}
                                                    type="text"
                                                    placeholder=""
                                                    disabled
                                                    value={(Math.round(osItemDetails.unitPrice * 100) / 100).toFixed(2)}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} className="mb-3">
                                                <Form.Label style={formLabel}>Disc %</Form.Label>
                                                <Form.Control
                                                    style={formControl}
                                                    type="text"
                                                    placeholder=""
                                                    disabled
                                                    value={osItemDetails.discount}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} className="mb-3">
                                                <Form.Label style={formLabel}>Total Price</Form.Label>
                                                <Form.Control
                                                    style={formControl}
                                                    type="number"
                                                    placeholder=""
                                                    disabled
                                                    value={(Math.round((osItemDetails.qty * osItemDetails.unitPrice) * 100) / 100).toFixed(2)}
                                                />
                                            </Form.Group>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="outline-secondary" size="sm" onClick={() => setShowEditOrderSaleModal(false)}><BsBackspaceReverseFill /> Cancel</Button>
                                        <Button variant="success" size="sm" onClick={handleUpdateOrderSale}><BsPencilFill /> Update Item</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Card.Header style={{ border: '#E4E5E6', backgroundColor: '#E4E5E6', padding: '0 0 0 0' }}>
                                    <Form style={{ float: 'left' }}>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Edit Mode"
                                            checked={isEdit}
                                            onClick={() => setIsEdit(!isEdit)}
                                        />
                                    </Form>
                                    <ButtonGroup as={Col} className="mb-2" style={{ float: 'right' }}>
                                        <ToggleButton
                                            key={3}
                                            type="radio"
                                            variant="warning"
                                            name="radio"
                                            style={{ borderRadius: '5px', marginLeft: '3px' }}
                                            onClick={printOrderSlip}
                                        >
                                            <BsFillPrinterFill />
                                        </ToggleButton>
                                        <ToggleButton
                                            key={4}
                                            type="radio"
                                            variant="success"
                                            name="radio"
                                            style={{ borderRadius: '5px', marginLeft: '3px' }}
                                            onClick={submitOrderSale}
                                        >
                                            <MdSend />
                                        </ToggleButton>
                                    </ButtonGroup>
                                </Card.Header>
                                <Card.Body id="orderSlip" style={orderSlipStyles}>
                                    <Alert
                                        variant={notif.variant}
                                        show={notif.status}
                                        onClose={() => setNotif({ status: false })}
                                        dismissible
                                    >
                                        <FaInfo /> {notif.message}
                                    </Alert>
                                    <h5 className='orderTitle' style={{ textAlign: 'center', marginTop: '10px' }}>Expert Care Pharmacy</h5>
                                    <p className='orderTitle' style={{ textAlign: 'center'}}>Lapu Lapu City, Cebu, Philippines 6000</p>
                                    <h6 style={{ textAlign: 'center', fontWeight: 'bolder' }}>Order Slip</h6>
                                    <br />
                                    <p><b style={formLabel}>Customer Name:</b> <span style={formControl}>{addedCx.fullName}</span></p>
                                    <p><b style={formLabel}>Processed Date:</b> <span style={formControl}>{procDate}</span></p>
                                    <Table
                                        striped
                                        hover
                                        size="sm"
                                        id="orderSlip"
                                        style={formControl}
                                    >
                                        <thead>
                                            <tr className='trItems'>
                                                <th className='trHeaders'></th>
                                                <th className='trHeaders'>No.</th>
                                                <th className='trHeaders'>Item No./Name</th>
                                                <th className='trHeaders'>Qty</th>
                                                <th className='trHeaders'>Unit Price</th>
                                                <th className='trHeaders'>Disc. %</th>
                                                <th className='trHeaders'>Total Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {addedSaleList.length >= 1 ? addedSaleList.map((sale, index) => {
                                                const { productId, itemName, itemNumber, qty, unitPrice, discount } = sale;
                                                return <tr key={index}>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {isEdit === true
                                                            ?   <span>
                                                                    <FaPencilAlt
                                                                        color='orange'
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            marginRight: '2px',
                                                                            border: '0px solid',
                                                                            borderRadius: '3px',
                                                                            height: '26px',
                                                                            width: '30px',
                                                                            padding: '6px'
                                                                        }}
                                                                        onClick={() => handleEditOrderSaleForm(sale)}
                                                                    />
                                                                    <FaMinusCircle
                                                                        color='red'
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            border: '0px solid',
                                                                            borderRadius: '3px',
                                                                            height: '26px',
                                                                            width: '30px',
                                                                            padding: '6px'
                                                                        }}
                                                                        onClick={e => handleRemoveSale(e, itemName, unitPrice * qty, productId, qty)}
                                                                    />
                                                                </span>
                                                            :   ''}
                                                    </td>
                                                    <td className='tbItem' style={{ textAlign: 'center' }}>{index + 1}</td>
                                                    <td>{itemNumber + '-' + itemName}</td>
                                                    <td className='tbItem' style={{ textAlign: 'center' }}>{qty}</td>
                                                    <td className='tbItem'>{'₱ ' + (Math.round(unitPrice * 100) / 100).toFixed(2)}</td>
                                                    <td className='tbItem'>{discount === 0 ? '' : discount + '%'}</td>
                                                    <td className='tbItem'>{'₱ ' + (Math.round((unitPrice * qty) * 100) / 100).toFixed(2)}</td>
                                                </tr>
                                            }): <tr><td colSpan="7" style={{ textAlign: 'center', }}>No sale item added yet.</td></tr>}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th className='tfTotalAmount' colSpan={5}></th>
                                                <th className='tfTotalAmount' style={{ textAlign: 'center' }}>Total Amount:</th>
                                                <th
                                                    className='valTotalAmount'
                                                    colSpan={1}
                                                    style={{ textAlign: 'center', color: 'red' }}
                                                >
                                                    {'₱ ' + (Math.round(amountDue * 100) / 100).toFixed(2)}
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
};