const { createPool } = require('mysql');
const key = require('ckey');

const pool = createPool({
    port: key.DB_PORT,
    host: key.DB_HOST,
    user: key.DB_USER,
    password: key.DB_PASS,
    database: key.DB_SCHEMA,
    connectionLimit: 10,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000
});

module.exports = pool;