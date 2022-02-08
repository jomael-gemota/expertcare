const pool = require('../../config/db');

module.exports = {
    getAllSales: callback => {
        pool.query(
            `SELECT * FROM expertcare.sale`,
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
            `SELECT * FROM expertcare.item`,
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
            `SELECT * FROM expertcare.purchase`,
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
            `SELECT * FROM expertcare.vendor`,
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
            `SELECT * FROM expertcare.customer`,
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
            delete sale.productId;
            delete sale.stock;
            saleArr.push(Object.values(sale));
        });

        pool.query(
            `INSERT INTO expertcare.sale (customerName, customerId, itemName, itemNumber, unitPrice, quantity, discount, saleDate) VALUES ?`,
            [saleArr],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                };

                return callback(null, results);
            }
        );
    },

    updateStockByProdId: (data, callback) => {
        pool.query(
            `UPDATE expertcare.item SET stock = ? WHERE productID = ?`,
            [
                data.stock,
                data.productId
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        )
    },

    updateSaleBySaleId: (data, callback) => {
        pool.query(
            `UPDATE expertcare.sale SET customerName = ?, itemName = ?, itemNumber = ?, quantity = ?, discount = ?, unitPrice = ? WHERE saleID = ?`,
            [
                data.customerName,
                data.itemName,
                data.itemNumber,
                data.quantity,
                data.discount,
                data.unitPrice,
                data.saleId,
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    deleteSaleBySaleId: (data, callback) => {
        pool.query(
            `DELETE FROM expertcare.sale WHERE saleID = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    addNewProduct: (data, callback) => {
        pool.query(
            `INSERT INTO expertcare.item (itemNumber, itemName, units, discount, stock, unitPrice, description) VALUES (?,?,?,?,?,?,?)`,
            [
                data.itemNumber,
                data.itemName,
                data.units,
                data.discount,
                data.stock,
                data.unitPrice,
                data.description
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    deleteProdByProdId: (data, callback) => {
        pool.query(
            `DELETE FROM expertcare.item WHERE productID = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    updateProductById: (data, callback) => {
        pool.query(
            `UPDATE expertcare.item SET itemName = ?, itemNumber = ?, units = ?, unitPrice = ?, stock = ?, discount = ?, description = ? WHERE productID = ?`,
            [
                data.itemName,
                data.itemNumber,
                data.units,
                data.unitPrice,
                data.stock,
                data.discount,
                data.description,
                data.productId
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    addNewPurchase: (data, callback) => {
        pool.query(
            `INSERT INTO expertcare.purchase (itemNumber, itemName, unitPrice, quantity, vendorName, vendorID, purchaseDate) VALUES (?,?,?,?,?,?,?)`,
            [
                data.itemNumber,
                data.itemName,
                data.unitPrice,
                data.quantity,
                data.vendorName,
                data.vendorId,
                data.purchaseDate
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    updatePurchaseById: (data, callback) => {
        pool.query(
            `UPDATE expertcare.purchase SET itemName = ?, itemNumber = ?, unitPrice = ?, quantity = ?, vendorName = ?, vendorID = ?, purchaseDate = ? WHERE purchaseID = ?`,
            [
                data.itemName,
                data.itemNumber,
                data.unitPrice,
                data.quantity,
                data.vendorName,
                data.vendorId,
                data.purchaseDate,
                data.purchaseId
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    deletePurchaseById: (data, callback) => {
        pool.query(
            `DELETE FROM expertcare.purchase WHERE purchaseID = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    addNewVendor: (data, callback) => {
        pool.query(
            `INSERT INTO expertcare.vendor (fullName, email, mobile, phone2, address, city, district) VALUES (?,?,?,?,?,?,?)`,
            [
                data.fullName,
                data.email,
                data.mobile,
                data.phone,
                data.address,
                data.city,
                data.district
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    updateVendorById: (data, callback) => {
        pool.query(
            `UPDATE expertcare.vendor SET fullName = ?, email = ?, mobile = ?, phone2 = ?, address = ?, city = ?, district = ? WHERE vendorID = ?`,
            [
                data.fullName,
                data.email,
                data.mobile,
                data.phone,
                data.address,
                data.city,
                data.district,
                data.vendorId
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    deleteVendorById: (data, callback) => {
        pool.query(
            `DELETE FROM expertcare.vendor WHERE vendorID = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    addNewCustomer: (data, callback) => {
        pool.query(
            `INSERT INTO expertcare.customer (fullName, illness, email, mobile, phone2, address, city, district) VALUES (?,?,?,?,?,?,?,?)`,
            [
                data.fullName,
                data.illness,
                data.email,
                data.mobile,
                data.phone,
                data.address,
                data.city,
                data.district
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    updateCustomerById: (data, callback) => {
        pool.query(
            `UPDATE expertcare.customer SET fullName = ?, illness = ?, email = ?, mobile = ?, phone2 = ?, address = ?, city = ?, district = ? WHERE customerID = ?`,
            [
                data.fullName,
                data.illness,
                data.email,
                data.mobile,
                data.phone,
                data.address,
                data.city,
                data.district,
                data.customerId
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },

    deleteCustomerById: (data, callback) => {
        pool.query(
            `DELETE FROM expertcare.customer WHERE customerID = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                };

                return callback(null, results);
            }
        );
    },
};