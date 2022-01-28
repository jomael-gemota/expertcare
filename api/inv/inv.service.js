const pool = require('../../config/db');

module.exports = {
    getAllSales: callback => {
        pool.query(
            `SELECT * FROM shop_inventory.sale`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                };

                return callback(null, results);
            }
        );
    },

    getAllProducts: callback => {
        pool.query(
            `SELECT * FROM shop_inventory.item`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                };

                return callback(null, results);
            }
        );
    },

    getAllPurchase: callback => {
        pool.query(
            `SELECT * FROM shop_inventory.purchase`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                };

                return callback(null, results);
            }
        );
    },

    getAllVendors: callback => {
        pool.query(
            `SELECT * FROM shop_inventory.vendor`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                };

                return callback(null, results);
            }
        );
    },

    getCustomerDatabase: callback => {
        pool.query(
            `SELECT * FROM shop_inventory.customer`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                };

                return callback(null, results);
            }
        );
    },

    createSale: (data, callback) => {
        let saleArr = [];

        data.map(sale => {
            saleArr.push(Object.values(sale));
        });

        console.log(data);

        pool.query(
            `INSERT INTO shop_inventory.sale (customerName, customerId, itemName, itemNumber, unitPrice, quantity, discount, saleDate) VALUES ?`,
            [saleArr],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                };

                return callback(null, results);
            }
        );
    } 
};