const key = require('ckey');
const {
    create,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    getUserByUsername,
    updatePasswordByUsername,
    getUserDetailsByUsername,
} = require('./user.service');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);

        body.password = hashSync(body.password, salt);

        create(body, (error, results) => {
            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: "Username already existed in the system."
                });
            };

            return res.status(200).json({
                success: 1,
                message: results
            });
        });
    },

    getUsers: (req, res) => {
        getUsers((error, results) => {
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

    getUserById: (req, res) => {
        const id = req.params.id;

        getUserById(id, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            if (!results) {
                return res.json({
                    success: 0,
                    message: "The user is cannot be found."
                });
            };

            return res.json({
                success: 1,
                message: results
            });
        });
    },

    updateUserById: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        updateUserById(body, (error, results) => {
            if (error) {
                console.log(error);
                return false;
            };

            if (!results) {
                return res.json({
                    success: 0,
                    message: "Updating user's details failed."
                });
            };

            return res.json({
                success: 1,
                message: "The user's details has been successfully updated."
            });
        });
    },

    updatePasswordByUsername: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.newPassword = hashSync(body.newPassword, salt);

        updatePasswordByUsername(body, (error, results) => {
            if (error) {
                console.log(error);
                return false;
            };

            if (!results) {
                return res.json({
                    success: 0,
                    message: "Updating user's password failed."
                });
            };

            return res.json({
                success: 1,
                message: "The user's password has been successfully updated."
            });
        });
    },

    deleteUserById: (req, res) => {
        const data = req.body;

        deleteUserById(data, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            if (results.affectedRows != 1) {
                return res.json({
                    success: 0,
                    message: "The user is cannot be found."
                });
            };

            return res.json({
                success: 1,
                message: "The user has been successfully deleted."
            });
        });
    },

    login: (req, res) => {
        const body = req.body;

        getUserByUsername(body.username, (error, results) => {
            if (error) {
                return res.json({
                    success: 0,
                    message: error
                });
            };

            if (!results) {
                return res.json({
                    success: 0,
                    message: "The username does not exist."
                });
            };

            const result = compareSync(body.password, results.password);

            if (result) {
                results.password = undefined;
                
                const jsontoken = sign({ result: results }, key.JSTOKEN_SECRET_KEY, {
                    // expiresIn: "1h"
                });

                return res.json({
                    success: 1,
                    message: "You have successfully logged in.",
                    token: jsontoken
                });
            } else {
                return res.json({
                    success: 0,
                    message: "You have entered an incorrect password."
                });
            };
        });
    },

    getUserDetailsByUsername: (req, res) => {
        const query = req.query;

        getUserDetailsByUsername(query, (error, results) => {
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