const ApplicationError = require('../../common/errors/Application.error');
const jobRepository = require('../../infrastructure/database/repository/job.repository');
const profileRepository = require('../../infrastructure/database/repository/profile.repository');
const { sequelize } = require('../../infrastructure/database/model');

const DEPOSIT_THRESOLD = 0.25;

const validateDepositThreshold = (debt, amount) => {
  const depositLimit = DEPOSIT_THRESOLD * debt;
  if (amount > depositLimit) {
    throw new ApplicationError(`Deposit amount exceeded threshold. Deposit available: ${depositLimit}`, 400);
  }
};

const deposit = async ({ profile: clientSenderProfile, userId: clientReceiverId, amount }) => {
  console.log(`Method: deposit - Deposit money to clientReceiverId: ${clientReceiverId}`);
  const txn = await sequelize.transaction();
  const dbOptions = { transaction: txn, lock: txn.LOCK.UPDATE };

  try {
    if (clientSenderProfile.type === 'client') {
      const debt = await jobRepository.getTotalPriceJobInProgressByClient(clientSenderProfile.id, dbOptions);
      validateDepositThreshold(debt, amount);
    }

    const receiverProfile = await profileRepository.getProfileById(clientReceiverId, dbOptions);

    if (!receiverProfile) {
      throw new ApplicationError('Receiver Profile not found', 404);
    }

    const receiverProfileUpdated = await profileRepository.updateBalance(
      clientReceiverId,
      amount,
      profileRepository.INCREASE,
      { transaction: txn },
    );

    await txn.commit();
    return receiverProfileUpdated;
  } catch (error) {
    console.log(`Method: deposit - An error has been occured: ${error}`);
    await txn.rollback();
    throw error;
  }
};

module.exports = deposit;
