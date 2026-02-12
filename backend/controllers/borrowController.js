const { BorrowedMaterial, Material, Employee } = require('../models');
const xlsx = require('xlsx');

exports.borrowMaterial = async (req, res) => {
    try {
        const { employee_id, material_ids, purpose } = req.body;

        for (const material_id of material_ids) {
            await BorrowedMaterial.create({ employee_id, material_id, purpose });
            const mat = await Material.findByPk(material_id);
            if (mat) {
                mat.status = 'borrowed';
                await mat.save();
            }
        }
        res.status(201).json({ message: 'Materials borrowed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.returnMaterial = async (req, res) => {
    try {
        const { employee_id } = req.body;
        const borrowings = await BorrowedMaterial.findAll({ where: { employee_id, is_returned: false } });

        for (const b of borrowings) {
            b.is_returned = true;
            await b.save();
            const mat = await Material.findByPk(b.material_id);
            if (mat) {
                mat.status = 'available';
                await mat.save();
            }
        }
        res.json({ message: 'All materials returned successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.returnIndividual = async (req, res) => {
    try {
        const { borrowed_ids } = req.body;
        for (const id of borrowed_ids) {
            const b = await BorrowedMaterial.findByPk(id);
            if (b) {
                b.is_returned = true;
                await b.save();
                const mat = await Material.findByPk(b.material_id);
                if (mat) {
                    mat.status = 'available';
                    await mat.save();
                }
            }
        }
        res.json({ message: 'Selected materials returned successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportData = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [{ model: BorrowedMaterial, where: { is_returned: false }, include: [Material], required: false }]
        });

        const borrowedData = [];
        employees.forEach(emp => {
            if (emp.BorrowedMaterials && emp.BorrowedMaterials.length > 0) {
                const materials = emp.BorrowedMaterials.map(b => `${b.Material.name} (SN: ${b.Material.serial_number})`).join(', ');
                borrowedData.push({
                    "Employee ID": emp.id,
                    "Name": `${emp.name} ${emp.father_name}`,
                    "Sex": emp.sex,
                    "Position": emp.position,
                    "Phone Number": emp.phone_number,
                    "Borrowed Materials": materials,
                    "Borrow Count": emp.BorrowedMaterials.length
                });
            }
        });

        const availableMaterials = await Material.findAll({ where: { status: 'available' } });
        const availableData = availableMaterials.map(m => ({
            "Material ID": m.id,
            "Material Name": m.name,
            "Serial Number": m.serial_number
        }));

        const wb = xlsx.utils.book_new();
        const ws1 = xlsx.utils.json_to_sheet(borrowedData.length ? borrowedData : [{ Note: "No borrowed employees" }]);
        const ws2 = xlsx.utils.json_to_sheet(availableData.length ? availableData : [{ Note: "No available materials" }]);

        xlsx.utils.book_append_sheet(wb, ws1, "Borrowed Employees");
        xlsx.utils.book_append_sheet(wb, ws2, "Available Materials");

        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=borrowed_and_available.xlsx');
        res.send(buf);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
