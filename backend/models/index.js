const Employee = require('./Employee');
const Material = require('./Material');
const BorrowedMaterial = require('./BorrowedMaterial');
const LeaveOutMember = require('./LeaveOutMember');
const WaitingReturn = require('./WaitingReturn');
const User = require('./User');

// Associations
Employee.hasMany(BorrowedMaterial, { foreignKey: 'employee_id' });
BorrowedMaterial.belongsTo(Employee, { foreignKey: 'employee_id' });

Material.hasMany(BorrowedMaterial, { foreignKey: 'material_id' });
BorrowedMaterial.belongsTo(Material, { foreignKey: 'material_id' });

Employee.hasOne(LeaveOutMember, { foreignKey: 'employee_id' });
LeaveOutMember.belongsTo(Employee, { foreignKey: 'employee_id' });

Employee.hasOne(WaitingReturn, { foreignKey: 'employee_id' });
WaitingReturn.belongsTo(Employee, { foreignKey: 'employee_id' });

module.exports = {
    Employee,
    Material,
    BorrowedMaterial,
    LeaveOutMember,
    WaitingReturn,
    User
};
