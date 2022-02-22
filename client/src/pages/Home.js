import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import getJwt from '../helper/getJwt';
import $ from 'jquery';
import dt from 'datatables.net';
import moment from 'moment';
import { ExportToCsv } from 'export-to-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import {
    Tab,
    Row,
    Col,
    CardGroup,
    Card,
    Tabs,
    Button,
    Table,
    FormGroup,
    Dropdown,
    Spinner,
    ButtonGroup,
} from 'react-bootstrap';
import {
    BsFileEarmarkPdfFill,
    BsPencilSquare,
    BsDownload,
    BsPlusCircleFill,
    BsTrashFill,
    BsFileEarmarkExcelFill,
    BsArrowRepeat,
    BsFillLayersFill,
} from 'react-icons/bs';
import {
    homeContainer,
    invCardHeader,
    cardTools,
} from '../css/styles';

import NavigationBar from '../components/navigations/NavigationBar';
import SideBar from '../components/navigations/SideBar';

export default function Home() {
    const [saleList, setSaleList] = useState([]);
    const [prodList, setProdList] = useState([]);
    const [purList, setPurList] = useState([]);
    const [vendList, setVendList] = useState([]);
    const [cxList, setCxList] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
    const [defActiveKey, setDefActiveKey] = useState('sales');

    window.alert = function () {};
    
    useEffect(() => {
        axios.get('/api/inv/getAllSales',
            { headers: { Authorization: getJwt() } })
            .then(res => {
                let saleArr = []
                res.data.message.map(item => {
                    saleArr.push({
                        saleId: item.saleID,
                        itemNumber: item.itemNumber,
                        customerId: item.customerID,
                        customerName: item.customerName,
                        itemName: item.itemName,
                        saleDate: item.saleDate,
                        discount: item.discount,
                        qty: item.quantity,
                        unitPrice: item.unitPrice
                    });
                });

                $(document).ready( function () {
                    $('#saleTable').DataTable({
                        order: [[ 0, "desc" ]],
                        "columnDefs": [
                            {"className": "dt-center", "targets": [0, 1, 4, 5, 6, 7]}
                        ]
                    });
                });

                return setSaleList(saleArr);

            }).catch(error => setSaleList({ key: error.name, text: error.message }));

            axios.get('/api/inv/getAllProducts',
                { headers: { Authorization: getJwt() } })
                .then(res => {
                    let prodArr = [];
                    res.data.message.map(prod => {
                        prodArr.push({
                            productId: prod.productID,
                            itemNumber: prod.itemNumber,
                            itemName: prod.itemName,
                            units: prod.units,
                            discount: prod.discount,
                            stock: prod.stock,
                            unitPrice: prod.unitPrice,
                            image: prod.imageURL,
                            status: prod.status,
                            description: prod.description
                        });
                    });

                    $(document).ready( function () {
                        $('#prodTable').DataTable({
                            order: [[ 1, "asc" ]],
                            "columnDefs": [
                                {"className": "dt-center", "targets": [0, 4, 5, 6]}
                            ]
                        });
                    });

                    return setProdList(prodArr);

                }).catch(error => setProdList({ key: error.name, text: error.message }));

            axios.get('/api/inv/getAllPurchase',
                { headers: { Authorization: getJwt() } })
                .then(res => {
                    let purArr = [];
                    res.data.message.map(pur => {
                        purArr.push({
                            purchaseId: pur.purchaseID,
                            itemName: pur.itemName,
                            itemNumber: pur.itemNumber,
                            quantity: pur.quantity,
                            unitPrice: pur.unitPrice,
                            vendorName: pur.vendorName,
                            vendorId: pur.vendorID,
                            purchaseDate: pur.purchaseDate
                        });
                    });

                    $(document).ready( function () {
                        $('#purTable').DataTable({
                            order: [[ 2, "asc" ]],
                            "columnDefs": [
                                {"className": "dt-center", "targets": [0, 3, 4, 6]}
                            ]
                        });
                    });

                    return setPurList(purArr);

                }).catch(error => setPurList({ key: error.name, text: error.message }));

            axios.get('/api/inv/getAllVendors',
                { headers: { Authorization: getJwt() } })
                .then(res => {
                    let vendArr = [];
                    res.data.message.map(vend => {
                        vendArr.push({
                            vendorId: vend.vendorID,
                            fullName: vend.fullName,
                            email: vend.email,
                            mobile: vend.mobile,
                            phone: vend.phone2,
                            address: vend.address,
                            city: vend.city,
                            district: vend.district
                        });
                    });

                    $(document).ready( function () {
                        $('#vendTable').DataTable({
                            order: [[ 1, "asc" ]],
                            "columnDefs": [
                                {"className": "dt-center", "targets": [0, 3, 4, 6]}
                            ]
                        });
                    });

                    return setVendList(vendArr);

                }).catch(error => setVendList({ key: error.name, text: error.message }));

            axios.get('/api/inv/getCustomerDatabase',
                { headers: { Authorization: getJwt() } })
                .then(res => {
                    let cxArr = [];
                    res.data.message.map(cx => {
                        cxArr.push({
                            customerId: cx.customerID,
                            fullName: cx.fullName,
                            illness: cx.illness,
                            email: cx.email,
                            mobile: cx.mobile,
                            phone: cx.phone2,
                            address: cx.address,
                            city: cx.city,
                            district: cx.district
                        });
                    });

                    $(document).ready( function () {
                        $('#cxTable').DataTable({
                            order: [[ 1, "asc" ]],
                            "columnDefs": [
                                {"className": "dt-center", "targets": [0, 4, 5]}
                            ]
                        });
                    });

                    return setCxList(cxArr);

                }).catch(error => setCxList({ key: error.name, text: error.message }));
                
    }, [isUpdate]);

    const arrayToCsv = (arrData, tbName) => {
        const mapKeys = transormFn => obj => Object.fromEntries(
            Object.entries(obj)
              .map(([key, value]) => [transormFn(key), value])
        );

        function replaceIt(text) {
            const result = text.replace(/([A-Z])/g, " $1");
            const finalResult = result.charAt(0).toUpperCase()+result.slice(1);
            return finalResult;
        };

        const toSentCase = arrData.map(mapKeys(replaceIt));

        const arrToCsvOpt = {
            fieldSeparator: ',',
            filename: `${tbName} ${moment(new Date()).format('MM-DD-YYYY_hhmmA')}`,
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true, 
            showTitle: false,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
    
        const csvExporter = new ExportToCsv(arrToCsvOpt);
        csvExporter.generateCsv(toSentCase);
    };

    const arrayToPDF = (arrData, tbName) => {
        const arrBody = [];
        const arrHeaders = [];
        const doc = new jsPDF('landscape');

        Object.getOwnPropertyNames(arrData[0]).map(head => {
            const strAddSpace = head.replace(/([A-Z])/g,' $1');
            const toSentCase = strAddSpace.charAt(0).toUpperCase()+strAddSpace.slice(1);
            
            arrHeaders.push(toSentCase);
        });

        arrData.map(obj => {
            let arrValues = Object.values(obj);
            arrBody.push(arrValues);
        });

        doc.autoTable({
            head: [arrHeaders],
            body: arrBody,
            margin: { horizontal: 10 },
            styles: { overflow: "linebreak" },
            bodyStyles: { valign: "top" },
            theme: "striped",
            showHead: "everyPage",
            didDrawPage: function (data) {
                doc.text(`Expert Care Pharmacy - ${tbName} Inventory`, data.settings.margin.left, 10);

                var str = "Page " + doc.internal.getNumberOfPages();
                doc.setFontSize(10);
            
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height
                  ? pageSize.height
                  : pageSize.getHeight();
                doc.text(str, data.settings.margin.left, pageHeight - 10);
            },
        });

        doc.save(`${tbName}_${moment(new Date()).format('MM-DD-YYYY_hhmmA')}.pdf`);
    };

    const refresh = () => {
        setIsLoadingRefresh(true);
        setIsUpdate(!isUpdate);

        setTimeout(function() {
            setIsLoadingRefresh(false);
        }, 2000);
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
                        <SideBar />
                    </Col>
                    <Col sm={10}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <CardGroup>
                                    <Card>
                                        <Card.Header style={invCardHeader}>
                                            <BsFillLayersFill /> Manage Inventory
                                            <Button
                                                size="sm"
                                                disabled={isLoadingRefresh}
                                                style={{ float: 'right', color: 'white', backgroundColor: '#1985AC', border: '1px solid #1985AC'}}
                                                onClick={refresh}
                                            >
                                                {isLoadingRefresh
                                                    ? <div><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Refreshing...</div>
                                                    : <span><BsArrowRepeat /> Refresh</span>}
                                            </Button>
                                        </Card.Header>
                                        <Card.Body>
                                            <Tabs defaultActiveKey={defActiveKey} id="uncontrolled-tab-example" className="mb-3">
                                                <Tab eventKey="sales" title="Sales" onClick={() => setDefActiveKey('sales')}>
                                                    <Card style={cardTools}>
                                                        <Card.Body>
                                                            <FormGroup>
                                                                <Link to='/home/add-new-sale'><Button size="sm" variant="success" style={{ marginRight: '5px' }}><BsPlusCircleFill /> Add Sale</Button></Link>
                                                                <Link to='/home/update-sale'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}><BsPencilSquare /> Edit Sale</Button></Link>
                                                                <Link to='/home/remove-sale'><Button size="sm" variant="outline-danger" style={{ marginRight: '5px' }}><BsTrashFill /> Remove Sale</Button></Link>
                                                                <Dropdown size="sm" as={ButtonGroup} style={{ float: 'right' }}>
                                                                    <Button variant="secondary" onClick={() => arrayToCsv(saleList, 'Sales')}><BsDownload /> Export Report</Button>
                                                                    <Dropdown.Toggle split variant="secondary" id="dropdown-custom-2" />
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item eventKey="1" onClick={() => arrayToCsv(saleList, 'Sales')}><BsFileEarmarkExcelFill color='#16A085' /> CSV</Dropdown.Item>
                                                                        <Dropdown.Item eventKey="2" onClick={() => arrayToPDF(saleList, 'Sales')}><BsFileEarmarkPdfFill color='#D35400' /> PDF</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </FormGroup>
                                                        </Card.Body>
                                                    </Card>
                                                    <br />
                                                    <Table striped bordered hover size='sm' id='saleTable'>
                                                        <thead>
                                                            <tr>
                                                                <th>Sale ID</th>
                                                                <th>Sale Date</th>
                                                                <th>Customer Name</th>
                                                                <th>Item Name</th>
                                                                <th>Discount</th>
                                                                <th>Qty</th>
                                                                <th>Unit Price</th>
                                                                <th>Total Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {saleList.length >= 1 ? saleList.map((sale, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{sale.saleId}</td>
                                                                    <td>{moment(sale.saleDate).format('MM/DD/YYYY')}</td>
                                                                    <td>{sale.customerName}</td>
                                                                    <td>{sale.itemName}</td>
                                                                    <td>{sale.discount === 0 ? '' : sale.discount + '%'}</td>
                                                                    <td>{sale.qty}</td>
                                                                    <td>{'₱ ' + (Math.round(sale.unitPrice * 100) / 100).toFixed(2)}</td>
                                                                    <td>{'₱ ' + (Math.round((sale.qty * sale.unitPrice) * 100) / 100).toFixed(2)}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                                <Tab eventKey="products" title="Products" onClick={() => setDefActiveKey('products')}>
                                                    <Card style={cardTools}>
                                                        <Card.Body>
                                                            <FormGroup>
                                                                <Link to='/home/add-new-product'><Button size="sm" variant="success" style={{ marginRight: '5px' }}><BsPlusCircleFill /> Add Product</Button></Link>
                                                                <Link to='/home/update-product'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}><BsPencilSquare /> Edit Product</Button></Link>
                                                                <Link to='/home/remove-product'><Button size="sm" variant="outline-danger"><BsTrashFill /> Remove Product</Button></Link>
                                                                <Dropdown size="sm" as={ButtonGroup} style={{ float: 'right' }}>
                                                                    <Button variant="secondary" onClick={() => arrayToCsv(prodList, 'Products')}><BsDownload /> Export Report</Button>
                                                                    <Dropdown.Toggle split variant="secondary" id="dropdown-custom-2" />
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item eventKey="1" onClick={() => arrayToCsv(prodList, 'Products')}><BsFileEarmarkExcelFill color='#16A085' /> CSV</Dropdown.Item>
                                                                        <Dropdown.Item eventKey="2" onClick={() => arrayToPDF(prodList, 'Products')}><BsFileEarmarkPdfFill color='#D35400' /> PDF</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </FormGroup>
                                                        </Card.Body>
                                                    </Card>
                                                    <br />
                                                    <Table striped bordered hover size='sm' id='prodTable'>
                                                        <thead>
                                                            <tr>
                                                                <th>Product ID</th>
                                                                <th>Item No.</th>
                                                                <th>Item Name</th>
                                                                <th>Units</th>
                                                                <th>Unit Price</th>
                                                                <th>Stock</th>
                                                                <th>Discount</th>
                                                                <th>Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {prodList.length >= 1 ? prodList.map((prod, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{prod.productId}</td>
                                                                    <td>{prod.itemNumber}</td>
                                                                    <td>{prod.itemName}</td>
                                                                    <td>{prod.units}</td>
                                                                    <td>{'₱ ' + (Math.round(prod.unitPrice * 100) / 100).toFixed(2)}</td>
                                                                    <td>{prod.stock}</td>
                                                                    <td>{prod.discount === 0 ? '' : prod.discount + '%'}</td>
                                                                    <td>{prod.description}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                                <Tab eventKey="purchase" title="Purchase" onClick={() => setDefActiveKey('purchase')}>
                                                    <Card style={cardTools}>
                                                        <Card.Body>
                                                            <FormGroup>
                                                                <Link to='/home/add-new-purchase'><Button size="sm" variant="success" style={{ marginRight: '5px' }}><BsPlusCircleFill /> Add Purchase</Button></Link>
                                                                <Link to='/home/update-purchase'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}><BsPencilSquare /> Edit Purchase</Button></Link>
                                                                <Link to='/home/remove-purchase'><Button size="sm" variant="outline-danger"><BsTrashFill /> Remove Purchase</Button></Link>
                                                                <Dropdown size="sm" as={ButtonGroup} style={{ float: 'right' }}>
                                                                    <Button variant="secondary" onClick={() => arrayToCsv(purList, 'Purchases')}><BsDownload /> Export Report</Button>
                                                                    <Dropdown.Toggle split variant="secondary" id="dropdown-custom-2" />
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item eventKey="1" onClick={() => arrayToCsv(purList, 'Purchases')}><BsFileEarmarkExcelFill color='#16A085' /> CSV</Dropdown.Item>
                                                                        <Dropdown.Item eventKey="2" onClick={() => arrayToPDF(purList, 'Purchases')}><BsFileEarmarkPdfFill color='#D35400' /> PDF</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </FormGroup>
                                                        </Card.Body>
                                                    </Card>
                                                    <br />
                                                    <Table striped bordered hover size='sm' id='purTable'>
                                                        <thead>
                                                            <tr>
                                                                <th>Purchase ID</th>
                                                                <th>Item No.</th>
                                                                <th>Item Name</th>
                                                                <th>Qty</th>
                                                                <th>Unit Price</th>
                                                                <th>Vendor Name</th>
                                                                <th>Purchase Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {purList.length >= 1 ? purList.map((pur, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{pur.purchaseId}</td>
                                                                    <td>{pur.itemNumber}</td>
                                                                    <td>{pur.itemName}</td>
                                                                    <td>{pur.quantity}</td>
                                                                    <td>{'₱ ' + (Math.round(pur.unitPrice * 100) / 100).toFixed(2)}</td>
                                                                    <td>{pur.vendorName}</td>
                                                                    <td>{moment(pur.purchaseDate).format('MM/DD/YYYY')}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                                <Tab eventKey="vendors" title="Vendors" onClick={() => setDefActiveKey('vendors')}>
                                                    <Card style={cardTools}>
                                                        <Card.Body>
                                                            <FormGroup>
                                                                <Link to='/home/add-new-vendor'><Button size="sm" variant="success" style={{ marginRight: '5px' }}><BsPlusCircleFill /> Add Vendor</Button></Link>
                                                                <Link to='/home/update-vendor'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}><BsPencilSquare /> Edit Vendor</Button></Link>
                                                                <Link to='/home/remove-vendor'><Button size="sm" variant="outline-danger"><BsTrashFill /> Remove Vendor</Button></Link>
                                                                <Dropdown size="sm" as={ButtonGroup} style={{ float: 'right' }}>
                                                                    <Button variant="secondary" onClick={() => arrayToCsv(vendList, 'Vendors')}><BsDownload /> Export Report</Button>
                                                                    <Dropdown.Toggle split variant="secondary" id="dropdown-custom-2" />
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item eventKey="1" onClick={() => arrayToCsv(vendList, 'Vendors')}><BsFileEarmarkExcelFill color='#16A085' /> CSV</Dropdown.Item>
                                                                        <Dropdown.Item eventKey="2" onClick={() => arrayToPDF(vendList, 'Vendors')}><BsFileEarmarkPdfFill color='#D35400' /> PDF</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </FormGroup>
                                                        </Card.Body>
                                                    </Card>
                                                    <br />
                                                    <Table striped bordered hover size='sm' id='vendTable'>
                                                        <thead>
                                                            <tr>
                                                                <th>Vendor ID</th>
                                                                <th>Full Name</th>
                                                                <th>Email Address</th>
                                                                <th>Mobile No.</th>
                                                                <th>Phone No.</th>
                                                                <th>Address</th>
                                                                <th>City</th>
                                                                <th>District</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {vendList.length >= 1 ? vendList.map((vend, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{vend.vendorId}</td>
                                                                    <td>{vend.fullName}</td>
                                                                    <td>{vend.email}</td>
                                                                    <td>{vend.mobile}</td>
                                                                    <td>{vend.phone === '0' ? '' : vend.phone}</td>
                                                                    <td>{vend.address}</td>
                                                                    <td>{vend.city}</td>
                                                                    <td>{vend.district}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                                <Tab eventKey="customer-database" title="Customer Database" onClick={() => setDefActiveKey('customer-database')}>
                                                    <Card style={cardTools}>
                                                        <Card.Body>
                                                            <FormGroup>
                                                                <Link to='/home/add-new-customer'><Button size="sm" variant="success" style={{ marginRight: '5px' }}><BsPlusCircleFill /> Add Customer</Button></Link>
                                                                <Link to='/home/update-customer'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}><BsPencilSquare /> Edit Customer</Button></Link>
                                                                <Link to='/home/remove-customer'><Button size="sm" variant="outline-danger"><BsTrashFill /> Remove Customer</Button></Link>
                                                                <Dropdown size="sm" as={ButtonGroup} style={{ float: 'right' }}>
                                                                    <Button variant="secondary" onClick={() => arrayToCsv(cxList, 'Customer Database')}><BsDownload /> Export Report</Button>
                                                                    <Dropdown.Toggle split variant="secondary" id="dropdown-custom-2" />
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item eventKey="1" onClick={() => arrayToCsv(cxList, 'Customer Database')}><BsFileEarmarkExcelFill color='#16A085' /> CSV</Dropdown.Item>
                                                                        <Dropdown.Item eventKey="2" onClick={() => arrayToPDF(cxList, 'Customer Database')}><BsFileEarmarkPdfFill color='#D35400' /> PDF</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </FormGroup>
                                                        </Card.Body>
                                                    </Card>
                                                    <br />
                                                    <Table striped bordered hover size='sm' id='cxTable'>
                                                        <thead>
                                                            <tr>
                                                                <th>Customer ID</th>
                                                                <th>Full Name</th>
                                                                <th>Illness</th>
                                                                <th>Email Address</th>
                                                                <th>Mobile No.</th>
                                                                <th>Phone No.</th>
                                                                <th>Address</th>
                                                                <th>City</th>
                                                                <th>District</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cxList.length >= 1 ? cxList.map((cx, index) => {
                                                                return <tr key={index} style={{ fontSize: '14px' }}>
                                                                    <td>{cx.customerId}</td>
                                                                    <td>{cx.fullName}</td>
                                                                    <td>{cx.illness}</td>
                                                                    <td>{cx.email}</td>
                                                                    <td>{cx.mobile}</td>
                                                                    <td>{cx.phone === '0' ? '' : cx.phone}</td>
                                                                    <td>{cx.address}</td>
                                                                    <td>{cx.city}</td>
                                                                    <td>{cx.district}</td>
                                                                </tr>
                                                            }): <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
                                            </Tabs>
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
    );
};