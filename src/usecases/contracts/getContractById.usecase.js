const ApplicationError = require('../../common/errors/Application.error');
const contractRepository = require('../../infrastructure/database/repository/contract.repository');

const getContractById = async ({ profileId, contractId }) => {
  console.log(`Method: getContractById - Getting files from profileId: ${profileId} and contractId: ${contractId}`);
  const contract = await contractRepository.getContractById(profileId, contractId);

  if (!contract) {
    throw new ApplicationError('Contract not found', 404);
  }

  return contract;
};

module.exports = getContractById;
