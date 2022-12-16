const contractRepository = require('../../infrastructure/database/repository/contract.repository');

const getContracts = async ({ profileId }) => {
  console.log(`Method: getContracts - Getting files from profileId: ${profileId}`);
  const contracts = await contractRepository.getContracts(profileId);
  return {
    count: contracts.length,
    contracts,
  };
};

module.exports = getContracts;
