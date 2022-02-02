const { success } = require('concurrently/src/defaults');
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
} = require('./inv.service');

module.exports = {
    getAllSales: (req, res) => {
        getAllSales((error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    getAllProducts: (req, res) => {
        getAllProducts((error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    getAllPurchase: (req, res) => {
        getAllPurchase((error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    getAllVendors: (req, res) => {
        getAllVendors((error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: SyntaxError
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    getCustomerDatabase: (req, res) => {
        getCustomerDatabase((error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    createSale: (req, res) => {
        const body = req.body;

        createSale(body, (error, results) => {
            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: error
                });
            };

            return res.status(200).json({
                success: 1,
                message: results
            });
        });
    },

    updateStockByProdId: (req, res) => {
        const body = req.body;

        updateStockByProdId(body, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    updateSaleBySaleId: (req, res) => {
        const body = req.body;

        updateSaleBySaleId(body, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },
    
    deleteSaleBySaleId: (req, res) => {
        const query = req.query;

        deleteSaleBySaleId(query, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    addNewProduct: (req, res) => {
        const body = req.body;

        addNewProduct(body, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    deleteProdByProdId: (req, res) => {
        const query = req.query;

        deleteProdByProdId(query, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    updateProductById: (req, res) => {
        const body = req.body;

        updateProductById(body, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    addNewPurchase: (req, res) => {
        const body = req.body;

        addNewPurchase(body, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    updatePurchaseById: (req, res) => {
        const body = req.body;

        updatePurchaseById(body, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    deletePurchaseById: (req, res) => {
        const query = req.query;

        deletePurchaseById(query, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },
};