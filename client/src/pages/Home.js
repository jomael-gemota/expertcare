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
    sidebarStyles,
    invCard,
    dtblTrStyles,
    cardStyles,
} from '../css/styles';
import '../css/sidebar.css';

import NavigationBar from '../components/navigations/NavigationBar';
import SideBar from '../components/navigations/SideBar';
import Services from '../components/navigations/Services';

export default function Home() {
    const [saleList, setSaleList] = useState([]);
    const [prodList, setProdList] = useState([]);
    const [purList, setPurList] = useState([]);
    const [vendList, setVendList] = useState([]);
    const [cxList, setCxList] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
    const [defActiveKey, setDefActiveKey] = useState('products');

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
                    var groupColumn = 1;
                    var table = $('#saleTable').DataTable({
                        "order": [[ groupColumn, 'asc' ]],
                        "columnDefs": [
                            {"className": "dt-center", "targets": [0, 4, 6]},
                            { "visible": false, "targets": groupColumn }
                        ],
                        "pageLength": 50,
                        "drawCallback": function ( settings ) {
                            var api = this.api();
                            var rows = api.rows( {page:'current'} ).nodes();
                            var last=null;
                 
                            api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                                if ( last !== group ) {
                                    $(rows).eq( i ).before(
                                        '<tr class="group"><td colspan="7">'+group+'</td></tr>'
                                    );
                 
                                    last = group;
                                }
                            } );
                        }
                    });

                    $('#saleTable tbody').on( 'click', 'tr.group', function () {
                        var currentOrder = table.order()[0];
                        if ( currentOrder[0] === groupColumn && currentOrder[1] === 'asc' ) {
                            table.order( [ groupColumn, 'desc' ] ).draw();
                        }
                        else {
                            table.order( [ groupColumn, 'asc' ] ).draw();
                        }
                    } );

                    new $.fn.dataTable.FixedHeader( table );
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
                                {"className": "dt-center", "targets": [5]},
                            ],
                            "pageLength": 50
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
                        var groupColumn = 5;
                        var table = $('#purTable').DataTable({
                            "order": [[ groupColumn, 'asc' ]],
                            "columnDefs": [
                                {"className": "dt-center", "targets": [0, 3]},
                                { "visible": false, "targets": groupColumn }
                            ],
                            "pageLength": 50,
                            "drawCallback": function ( settings ) {
                                var api = this.api();
                                var rows = api.rows( {page:'current'} ).nodes();
                                var last=null;
                     
                                api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                                    if ( last !== group ) {
                                        $(rows).eq( i ).before(
                                            '<tr class="group"><td colspan="6">'+group+'</td></tr>'
                                        );
                     
                                        last = group;
                                    }
                                } );
                            }
                        });

                        $('#purTable tbody').on( 'click', 'tr.group', function () {
                            var currentOrder = table.order()[0];
                            if ( currentOrder[0] === groupColumn && currentOrder[1] === 'asc' ) {
                                table.order( [ groupColumn, 'desc' ] ).draw();
                            }
                            else {
                                table.order( [ groupColumn, 'asc' ] ).draw();
                            }
                        } );
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
                            order: [[ 0, "asc" ]],
                            "columnDefs": [
                                // {"className": "dt-center", "targets": [2, 3]}
                            ],
                            "pageLength": 50
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
                            order: [[ 0, "asc" ]],
                            "columnDefs": [
                                // {"className": "dt-center", "targets": [3, 4]}
                            ],
                            "pageLength": 50
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
                    <Col sm={10}>
                        <Tab.Content style={{ margin: '100px 30px 30px 50px' }}>
                            <Tab.Pane eventKey="first">
                                <CardGroup style={invCard}>
                                    <Card style={cardStyles}>
                                        <Card.Header style={invCardHeader}>
                                            <BsFillLayersFill /> Manage Inventory
                                        </Card.Header>
                                        <Card.Body style={{ fontSize: '13px' }}>
                                            <Tabs defaultActiveKey={defActiveKey} id="uncontrolled-tab-example" className="mb-3">
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
                                                    <Table striped bordered hover size='sm' id='prodTable' style={{ fontSize: '13px' }}>
                                                        <thead>
                                                            <tr>
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
                                                                return <tr key={index} style={{ fontSize: '13px' }}>
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
                                                    <Table striped bordered hover size='sm' id='vendTable' style={{ fontSize: '13px' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Vendor Name</th>
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
                                                                return <tr key={index} style={{ fontSize: '13px' }}>
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
                                                    <Table bordered striped hover size='sm' id='purTable' style={{ fontSize: '13px', width: '100%' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Purchase Date</th>
                                                                <th>Item No.</th>
                                                                <th>Item Name</th>
                                                                <th>Qty</th>
                                                                <th>Unit Price</th>
                                                                <th>Vendor Name</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {purList.length >= 1 ? purList.map((pur, index) => {
                                                                return <tr key={index} style={{ fontSize: '13px' }}>
                                                                    <td>{moment(pur.purchaseDate).format('MM/DD/YYYY')}</td>
                                                                    <td>{pur.itemNumber}</td>
                                                                    <td>{pur.itemName}</td>
                                                                    <td>{pur.quantity}</td>
                                                                    <td>{'₱ ' + (Math.round(pur.unitPrice * 100) / 100).toFixed(2)}</td>
                                                                    <td>{pur.vendorName}</td>
                                                                </tr>
                                                            }): <tr>
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
                                                <Tab eventKey="customer-database" title="Patient Record Database" onClick={() => setDefActiveKey('customer-database')}>
                                                    <Card style={cardTools}>
                                                        <Card.Body>
                                                            <FormGroup>
                                                                <Link to='/home/add-new-customer'><Button size="sm" variant="success" style={{ marginRight: '5px' }}><BsPlusCircleFill /> Add Record</Button></Link>
                                                                <Link to='/home/update-customer'><Button size="sm" variant="warning" style={{ marginRight: '5px' }}><BsPencilSquare /> Edit Record</Button></Link>
                                                                <Link to='/home/remove-customer'><Button size="sm" variant="outline-danger"><BsTrashFill /> Remove Record</Button></Link>
                                                                <Dropdown size="sm" as={ButtonGroup} style={{ float: 'right' }}>
                                                                    <Button variant="secondary" onClick={() => arrayToCsv(cxList, 'Patient Record Database')}><BsDownload /> Export Report</Button>
                                                                    <Dropdown.Toggle split variant="secondary" id="dropdown-custom-2" />
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item eventKey="1" onClick={() => arrayToCsv(cxList, 'Patient Record Database')}><BsFileEarmarkExcelFill color='#16A085' /> CSV</Dropdown.Item>
                                                                        <Dropdown.Item eventKey="2" onClick={() => arrayToPDF(cxList, 'Patient Record Database')}><BsFileEarmarkPdfFill color='#D35400' /> PDF</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </FormGroup>
                                                        </Card.Body>
                                                    </Card>
                                                    <br />
                                                    <Table striped bordered hover size='sm' id='cxTable' style={{ fontSize: '13px' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Patient Name</th>
                                                                <th>Chief Complaint</th>
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
                                                                return <tr key={index} style={{ fontSize: '13px' }}>
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
                                                                </tr>}
                                                        </tbody>
                                                    </Table>
                                                </Tab>
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
                                                    <Table bordered striped hover size='sm' id='saleTable' style={{ fontSize: '13px', width: '100%' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Sale Date</th>
                                                                <th>Customer Name</th>
                                                                <th>Item Number</th>
                                                                <th>Item Name</th>
                                                                <th>Qty</th>
                                                                <th>Unit Price</th>
                                                                <th>Discount</th>
                                                                <th>Total Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {saleList.length >= 1 ? saleList.map((sale, index) => {
                                                                return <tr key={index} style={{ fontSize: '13px' }}>
                                                                    <td>{moment(sale.saleDate).format('MM/DD/YYYY')}</td>
                                                                    <td>{sale.customerName}</td>
                                                                    <td>{sale.itemNumber}</td>
                                                                    <td>{sale.itemName}</td>
                                                                    <td>{sale.qty}</td>
                                                                    <td>{'₱ ' + (Math.round(sale.unitPrice * 100) / 100).toFixed(2)}</td>
                                                                    <td>{sale.discount === 0 ? '' : sale.discount + '%'}</td>
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
                                            </Tabs>
                                        </Card.Body>
                                    </Card>
                                </CardGroup>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <Services />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
};