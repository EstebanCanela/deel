const { Op } = require('sequelize');
const { Contract } = require('../model');

const getContractById = async (profileId, contractId) => Contract.findOne({
  where: {
    id: contractId,
    [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
  },
});

const getContracts = async (profileId) => Contract.findAll(
  {
    where: {
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
      status: {
        [Op.not]: 'terminated',
      },
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  },
);

module.exports = {
  getContractById,
  getContracts,
};
