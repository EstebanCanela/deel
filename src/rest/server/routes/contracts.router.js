const express = require('express');
const { getProfile } = require('../../middleware/getProfile');
const contractController = require('../../controllers/contracts.controller');

const router = express.Router();

router.get('/', getProfile, contractController.getContracts);

router.get('/:id', getProfile, contractController.getContractById);

module.exports = router;
