const { Material } = require('../models');
const xlsx = require('xlsx');

exports.getMaterials = async (req, res) => {
    try {
        const materials = await Material.findAll();
        res.json(materials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMaterial = async (req, res) => {
    try {
        const mat = await Material.findByPk(req.params.id);
        if (!mat) return res.status(404).json({ message: 'Material not found' });
        await mat.update(req.body);
        res.json(mat);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addMaterial = async (req, res) => {
    try {
        const existing = await Material.findOne({ where: { serial_number: req.body.serial_number } });
        if (existing) return res.status(400).json({ message: 'Serial number already exists' });
        const mat = await Material.create(req.body);
        res.status(201).json(mat);
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
            const serial_number = String(row.serial_number || '').trim();

            if (!name || !serial_number) continue;

            const [mat, created] = await Material.findOrCreate({
                where: { serial_number },
                defaults: { name, status: 'available' }
            });
            if (created) added++;
            else skipped++;
        }
        res.json({ message: `Added ${added} materials. Skipped ${skipped} duplicates.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportMaterials = async (req, res) => {
    console.log('Export materials requested by:', req.user.username);
    try {
        const materials = await Material.findAll();

        const data = materials.map(mat => ({
            "Material Name": mat.name,
            "Serial Number": mat.serial_number,
            "Status": mat.status,
            "Date Added": new Date(mat.createdAt).toLocaleDateString()
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data.length ? data : [{ Note: "No materials found" }]);
        xlsx.utils.book_append_sheet(wb, ws, "Inventory");
        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=inventory_list.xlsx');
        res.send(buf);
    } catch (err) {
        console.error('EXPORT MATERIALS ERROR:', err);
        res.status(500).json({ message: err.message });
    }
};
