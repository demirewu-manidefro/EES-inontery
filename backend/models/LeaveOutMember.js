const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveOutMember = sequelize.define('LeaveOutMember', {
    leave_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'leave_out_members'
});

module.exports = LeaveOutMember;
