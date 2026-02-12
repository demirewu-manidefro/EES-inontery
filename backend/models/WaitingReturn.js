const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WaitingReturn = sequelize.define('WaitingReturn', {
    added_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'waiting_return'
});

module.exports = WaitingReturn;
