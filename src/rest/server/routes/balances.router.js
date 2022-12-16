const express = require('express');
const { getProfile } = require('../../middleware/getProfile');
const balancesController = require('../../controllers/balances.controller');

const router = express.Router();

router.post('/deposit/:userId', getProfile, balancesController.depositClient);

module.exports = router;
