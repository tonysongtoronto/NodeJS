const mysql =require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'node-complete',
    user: 'root',
    password: '@nvtgf7TH'
});

module.exports = pool.promise();