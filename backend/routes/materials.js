const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { auth, admin } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', auth, materialController.getMaterials);
router.post('/', auth, materialController.addMaterial);
router.post('/upload', auth, admin, upload.single('file'), materialController.bulkUpload);
router.put('/:id', auth, admin, materialController.updateMaterial);
router.get('/export', auth, admin, materialController.exportMaterials);

module.exports = router;
