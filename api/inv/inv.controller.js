const {
    getAllSales,
    getAllProducts,
    getAllPurchase,
    getAllVendors,
    getCustomerDatabase,
    createSale
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
    }
};