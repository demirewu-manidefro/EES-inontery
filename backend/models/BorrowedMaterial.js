const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BorrowedMaterial = sequelize.define('BorrowedMaterial', {
    purpose: {
        type: DataTypes.STRING
    },
    borrow_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    is_returned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'borrowed_materials'
});

module.exports = BorrowedMaterial;
