const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { auth, admin } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', auth, employeeController.getEmployees);
router.post('/', auth, employeeController.addEmployee);
router.get('/leave-out', auth, employeeController.getLeaveOut);
router.post('/bulk-upload', auth, admin, upload.single('file'), employeeController.bulkUpload);
router.post('/approve-leave/:id', auth, admin, employeeController.approveLeave);
router.post('/return-from-leave/:id', auth, admin, employeeController.returnFromLeave);
router.post('/waiting/:id', auth, employeeController.addToWaiting);
router.post('/waiting-remove/:id', auth, employeeController.removeFromWaiting);

router.get('/export', auth, admin, employeeController.exportEmployees);
router.get('/export-leave-out', auth, admin, employeeController.exportLeaveOut);

module.exports = router;
