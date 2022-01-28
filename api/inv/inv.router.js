const {
    getAllSales,
    getAllProducts,
    getAllPurchase,
    getAllVendors,
    getCustomerDatabase,
    createSale
} = require('./inv.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/token_validation');

router.get('/getAllSales', checkToken, getAllSales);
router.get('/getAllProducts', checkToken, getAllProducts);
router.get('/getAllPurchase', checkToken, getAllPurchase);
router.get('/getAllVendors', checkToken, getAllVendors);
router.get('/getCustomerDatabase', checkToken, getCustomerDatabase);
router.post('/createSale', createSale);

module.exports = router;