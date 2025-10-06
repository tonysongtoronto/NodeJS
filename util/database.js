const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '@nvtgf7TH', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

module.exports = sequelize;