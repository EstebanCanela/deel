const jobRepository = require('../../infrastructure/database/repository/job.repository');
const profileRepository = require('../../infrastructure/database/repository/profile.repository');
const ApplicationError = require('../../common/errors/Application.error');
const { sequelize } = require('../../infrastructure/database/model');

const payJob = async ({ profileId, jobId }) => {
  console.log(`Method: payJob - Paying jobs from client profile: ${profileId}`);
  const txn = await sequelize.transaction();
  const dbOptions = { transaction: txn, Lock: txn.LOCK.UPDATE };

  try {
    const unpaidJob = await jobRepository.getUnpaidJobById(profileId, jobId, dbOptions);

    if (!unpaidJob) {
      throw new ApplicationError('Unpaid Job - Not Found', 404);
    }

    const contract = await unpaidJob.getContract();

    const clientProfile = await profileRepository.getProfileById(profileId, dbOptions);
    const contractorProfile = await profileRepository.getProfileById(contract.get('ContractorId'), dbOptions);

    const jobPrice = unpaidJob.get('price');

    if (clientProfile.get('balance') < jobPrice) {
      throw new ApplicationError('Insufficient funds', 400);
    }

    const [,, resultContractorProfile] = await Promise.all([
      jobRepository.setJobAsPaid(unpaidJob.id, { transaction: txn }),
      profileRepository.updateBalance(clientProfile.id, jobPrice, profileRepository.DECREASE, { transaction: txn }),
      profileRepository.updateBalance(contractorProfile.id, jobPrice, profileRepository.INCREASE, { transaction: txn }),
    ]);

    await txn.commit();
    return {
      status: 'SUCCESS',
      data: resultContractorProfile,
    };
  } catch (error) {
    console.log(`Method: payJob - An error has been occured: ${error}`);
    txn.rollback();
    throw error;
  }
};

module.exports = payJob;
