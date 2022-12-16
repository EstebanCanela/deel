const jobRepository = require('../../infrastructure/database/repository/job.repository');

const getUnpaidJobs = async ({ profileId }) => {
  console.log(`Method: getUnpaidJobs - Getting unpaid jobs for profileId: ${profileId}`);
  const unpaidJobs = await jobRepository.getUnpaidJobs(profileId);
  return {
    count: unpaidJobs.length,
    jobs: unpaidJobs,
  };
};

module.exports = getUnpaidJobs;
