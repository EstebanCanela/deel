const assert = require('assert');
const createHttpError = require('http-errors');
const contractsUseCase = require('../../usecases/contracts');

const getContracts = async (req, res, next) => {
  try {
    const profileId = req.profile?.id;
    const contracts = await contractsUseCase.getContracts({ profileId });
    res.status(200).json(contracts).end();
  } catch (error) {
    next(error);
  }
};

const getContractById = async (req, res, next) => {
  try {
    const profileId = req.profile?.id;
    const contractId = req.params.id;
    assert(contractId, createHttpError.BadRequest());
    const contract = await contractsUseCase.getContractById({ profileId, contractId });
    res.status(200).json(contract).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContracts,
  getContractById,
};
