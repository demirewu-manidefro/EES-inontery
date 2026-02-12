const { User, Employee, Material, BorrowedMaterial, WaitingReturn, LeaveOutMember } = require('../models');
const xlsx = require('xlsx');

exports.getPendingUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { is_approved: false } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.approveUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.is_approved = true;
        await user.save();
        res.json({ message: 'User approved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.destroy();
        res.json({ message: 'User rejected and deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const totalEmployees = await Employee.count({ where: { status: 'active' } });
        const totalMaterials = await Material.count({ where: { status: 'available' } });
        const borrowedCount = await BorrowedMaterial.count({ where: { is_returned: false } });
        const waitingCount = await WaitingReturn.count();
        const leaveCount = await LeaveOutMember.count();

        res.json({
            totalEmployees,
            totalMaterials,
            borrowedCount,
            waitingCount,
            leaveCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getWaitingList = async (req, res) => {
    try {
        const list = await WaitingReturn.findAll({
            include: [{ model: Employee }]
        });
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportWaitingList = async (req, res) => {
    console.log('Export waiting list requested by:', req.user.username);
    try {
        const list = await WaitingReturn.findAll({
            include: [{ model: Employee }]
        });

        const data = list.map(item => {
            const emp = item.Employee;
            return {
                "Name": `${emp.name} ${emp.father_name} ${emp.grand_father_name}`,
                "Sex": emp.sex,
                "Position": emp.position,
                "Phone Number": emp.phone_number,
                "Project": emp.project,
                "Added Date": new Date(item.createdAt).toLocaleDateString()
            };
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data.length ? data : [{ Note: "No employees in waiting list" }]);
        xlsx.utils.book_append_sheet(wb, ws, "Waiting List");
        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=waiting_list.xlsx');
        res.send(buf);
    } catch (err) {
        console.error('EXPORT WAITING LIST ERROR:', err);
        res.status(500).json({ message: err.message });
    }
};
