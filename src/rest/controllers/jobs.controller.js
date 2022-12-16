const assert = require('assert');
const createHttpError = require('http-errors');
const jobsUseCase = require('../../usecases/jobs');

const getUnpaidJobs = async (req, res, next) => {
  try {
    const profileId = req.profile?.id;
    const contracts = await jobsUseCase.getUnpaidJobs({ profileId });
    res.status(200).json(contracts).end();
  } catch (error) {
    next(error);
  }
};

const payJob = async (req, res, next) => {
  try {
    const { profile } = req;
    const jobId = req.params.job_id;
    assert(jobId, createHttpError.BadRequest());
    const payedJob = await jobsUseCase.payJob({ profileId: profile.id, jobId });
    res.status(200).json(payedJob).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUnpaidJobs,
  payJob,
};
