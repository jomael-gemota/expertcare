const pool = require('../../config/db');

module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT INTO shop_inventory.user (fullName, username, password, status)
            VALUES (?,?,?,?)`,
            [
                data.fullname,
                data.username,
                data.password,
                data.status,
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                };

                return callback(null, results);
            }
        );
    },

    getUsers: callback => {
        pool.query(
            `SELECT * FROM shop_inventory.user`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }

                return callback(null, results);
            }
        );
    },

    getUserById: (id, callback) => {
        pool.query(
            `SELECT * FROM shop_inventory.user WHERE userID = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }

                return callback(null, results[0]);
            }
        );
    },

    updateUserById: (data, callback) => {
        pool.query(
            `UPDATE shop_inventory.user SET fullName = ?, username = ?, password = ?, status = ? WHERE userID = ?`,
            [
                data.fullname,
                data.username,
                data.password,
                data.status,
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }

                return callback(null, results);
            }
        );
    },

    updatePasswordByUsername: (data, callback) => {
        pool.query(
            `UPDATE shop_inventory.user SET password = ? WHERE username = ?`,
            [
                data.newPassword,
                data.username
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }

                return callback(null, results);
            }
        );
    },

    deleteUserById: (data, callback) => {
        pool.query(
            `DELETE FROM shop_inventory.user WHERE userID = ?`,
            [data.id],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results)
            }
        );
    },

    getUserByUsername: (username, callback) => {
        pool.query(
            `SELECT * FROM shop_inventory.user WHERE username = ?`,
            [username],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        );
    }
};