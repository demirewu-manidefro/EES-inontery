const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, admin } = require('../middleware/auth');

router.get('/pending-users', auth, admin, adminController.getPendingUsers);
router.post('/approve-user/:id', auth, admin, adminController.approveUser);
router.post('/reject-user/:id', auth, admin, adminController.rejectUser);

// User Management Routes
router.get('/users', auth, admin, adminController.getUsers);
router.post('/user', auth, admin, adminController.createUser);
router.put('/user/:id', auth, admin, adminController.updateUser);
router.delete('/user/:id', auth, admin, adminController.deleteUser);

router.get('/stats', auth, admin, adminController.getStats);
router.get('/waiting-list', auth, admin, adminController.getWaitingList);
router.get('/waiting-list/export', auth, admin, adminController.exportWaitingList);

module.exports = router;
