const {
    getAllSales,
    getAllProducts,
    getAllPurchase,
    getAllVendors,
    getCustomerDatabase,
    createSale,
    updateStockByProdId,
    updateSaleBySaleId,
    deleteSaleBySaleId,
    addNewProduct,
    deleteProdByProdId,
    updateProductById,
    addNewPurchase,
    updatePurchaseById,
    deletePurchaseById,
    addNewVendor,
    updateVendorById,
    deleteVendorById,
    addNewCustomer,
    updateCustomerById,
    deleteCustomerById,
} = require('./inv.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/token_validation');

router.get('/getAllSales', checkToken, getAllSales);
router.get('/getAllProducts', checkToken, getAllProducts);
router.get('/getAllPurchase', checkToken, getAllPurchase);
router.get('/getAllVendors', checkToken, getAllVendors);
router.get('/getCustomerDatabase', checkToken, getCustomerDatabase);

router.post('/createSale', checkToken, createSale);
router.patch('/updateStockByProdId', checkToken, updateStockByProdId);
router.patch('/updateSaleBySaleId', checkToken, updateSaleBySaleId);
router.delete('/deleteSaleBySaleId', checkToken, deleteSaleBySaleId);

router.post('/addNewProduct', checkToken, addNewProduct);
router.delete('/deleteProdByProdId', checkToken, deleteProdByProdId);
router.patch('/updateProductById', checkToken, updateProductById);

router.post('/addNewPurchase', checkToken, addNewPurchase);
router.patch('/updatePurchaseById', checkToken, updatePurchaseById);
router.delete('/deletePurchaseById', checkToken, deletePurchaseById);

router.post('/addNewVendor', checkToken, addNewVendor);
router.patch('/updateVendorById', checkToken, updateVendorById);
router.delete('/deleteVendorById', checkToken, deleteVendorById);

router.post('/addNewCustomer', checkToken, addNewCustomer);
router.patch('/updateCustomerById', checkToken, updateCustomerById);
router.delete('/deleteCustomerById', checkToken, deleteCustomerById);

module.exports = router;