const { Employee, BorrowedMaterial, Material, WaitingReturn, LeaveOutMember } = require('../models');
const { Op } = require('sequelize');
const xlsx = require('xlsx');

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: { status: { [Op.ne]: 'left' } },
            include: [{ model: BorrowedMaterial, where: { is_returned: false }, required: false, include: [Material] }]
        });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addEmployee = async (req, res) => {
    try {
        const existing = await Employee.findOne({
            where: { name: req.body.name, father_name: req.body.father_name, grand_father_name: req.body.grand_father_name }
        });
        if (existing) return res.status(400).json({ message: 'Employee already exists' });

        const emp = await Employee.create(req.body);
        res.status(201).json(emp);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.bulkUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let added = 0;
        let skipped = 0;

        for (const row of data) {
            const name = String(row.name || '').trim();
            const father_name = String(row.father_name || '').trim();
            const grand_father_name = String(row.grand_father_name || '').trim();

            if (!name || !father_name) continue;

            const [emp, created] = await Employee.findOrCreate({
                where: { name, father_name, grand_father_name },
                defaults: {
                    sex: row.sex || 'M',
                    position: row.position || '',
                    employment_status: row.employment_status || 'Permanent',
                    phone_number: String(row.phone_number || ''),
                    project: row.project || '',
                    status: 'active'
                }
            });
            if (created) added++;
            else skipped++;
        }
        res.json({ message: `Added ${added} employees. Skipped ${skipped} duplicates.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.approveLeave = async (req, res) => {
    try {
        const emp = await Employee.findByPk(req.params.id);
        if (!emp) return res.status(404).json({ message: 'Employee not found' });

        const borrowed = await BorrowedMaterial.findOne({ where: { employee_id: emp.id, is_returned: false } });
        if (borrowed) return res.status(400).json({ message: 'Employee has borrowed materials' });

        await LeaveOutMember.findOrCreate({ where: { employee_id: emp.id } });
        emp.status = 'left';
        await emp.save();
        res.json({ message: 'Leave approved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.returnFromLeave = async (req, res) => {
    try {
        const emp = await Employee.findByPk(req.params.id);
        if (!emp) return res.status(404).json({ message: 'Employee not found' });

        await LeaveOutMember.destroy({ where: { employee_id: emp.id } });
        emp.status = 'active';
        await emp.save();
        res.json({ message: 'Return from leave approved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLeaveOut = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: { status: 'left' },
            include: [{ model: LeaveOutMember }]
        });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToWaiting = async (req, res) => {
    try {
        const emp = await Employee.findByPk(req.params.id);
        const borrowed = await BorrowedMaterial.findOne({ where: { employee_id: req.params.id, is_returned: false } });
        if (!borrowed) return res.status(400).json({ message: 'No borrowed materials' });

        await WaitingReturn.findOrCreate({ where: { employee_id: req.params.id } });
        res.json({ message: 'Added to waiting list' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeFromWaiting = async (req, res) => {
    try {
        await WaitingReturn.destroy({ where: { employee_id: req.params.id } });
        res.json({ message: 'Removed from waiting list' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportEmployees = async (req, res) => {
    console.log('Export employees requested by:', req.user.username);
    try {
        console.log('Fetching employees...');
        const employees = await Employee.findAll({
            where: { status: { [Op.ne]: 'left' } },
            include: [{ model: BorrowedMaterial, where: { is_returned: false }, required: false, include: [Material] }]
        });
        console.log(`Found ${employees.length} employees`);

        const data = employees.map(emp => {
            const borrowedItems = emp.BorrowedMaterials ? emp.BorrowedMaterials.map(b => `${b.Material.name} (SN: ${b.Material.serial_number})`).join(', ') : 'None';
            return {
                "Name": `${emp.name} ${emp.father_name} ${emp.grand_father_name}`,
                "Sex": emp.sex,
                "Position": emp.position,
                "Employment Status": emp.employment_status,
                "Phone Number": emp.phone_number,
                "Project": emp.project,
                "Borrowed Items": borrowedItems,
                "Borrow Count": emp.BorrowedMaterials ? emp.BorrowedMaterials.length : 0
            };
        });
        console.log('Mapped data, total rows:', data.length);

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data.length ? data : [{ Note: "No employees found" }]);
        xlsx.utils.book_append_sheet(wb, ws, "Employees");
        console.log('Workbook created');
        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        console.log('Buffer created, size:', buf.length);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=employees_list.xlsx');
        res.send(buf);
        console.log('Response sent for employees');
    } catch (err) {
        console.error('EXPORT EMPLOYEES ERROR:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.exportLeaveOut = async (req, res) => {
    console.log('Export leave-out requested by:', req.user.username);
    try {
        const employees = await Employee.findAll({
            where: { status: 'left' },
            include: [{ model: LeaveOutMember }]
        });

        const data = employees.map(emp => ({
            "Name": `${emp.name} ${emp.father_name} ${emp.grand_father_name}`,
            "Sex": emp.sex,
            "Position": emp.position,
            "Employment Status": emp.employment_status,
            "Phone Number": emp.phone_number,
            "Project": emp.project,
            "Leave Date": emp.LeaveOutMember ? new Date(emp.LeaveOutMember.leave_date).toLocaleDateString() : 'N/A'
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data.length ? data : [{ Note: "No leave-out members found" }]);
        xlsx.utils.book_append_sheet(wb, ws, "Leave Out Members");
        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=leave_out_members.xlsx');
        res.send(buf);
        console.log('Response sent for leave-out');
    } catch (err) {
        console.error('EXPORT LEAVE OUT ERROR:', err);
        res.status(500).json({ message: err.message });
    }
};
