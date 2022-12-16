const express = require('express');
const { getProfile } = require('../../middleware/getProfile');
const jobsController = require('../../controllers/jobs.controller');

const router = express.Router();

router.get('/unpaid', getProfile, jobsController.getUnpaidJobs);

router.post('/:job_id/pay', getProfile, jobsController.payJob);

module.exports = router;
