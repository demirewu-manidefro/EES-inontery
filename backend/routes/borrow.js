const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { auth } = require('../middleware/auth');

router.post('/borrow', auth, borrowController.borrowMaterial);
router.post('/return', auth, borrowController.returnMaterial);
router.post('/return-individual', auth, borrowController.returnIndividual);
router.get('/export', auth, borrowController.exportData);

module.exports = router;
