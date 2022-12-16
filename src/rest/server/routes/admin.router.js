const express = require('express');
const adminController = require('../../controllers/admin.controller');

const router = express.Router();

router.get('/deposit/best-profession', adminController.getBestProfession);
router.get('/deposit/best-clients', adminController.getBestPayers);

module.exports = router;
