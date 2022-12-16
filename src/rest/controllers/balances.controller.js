const assert = require('assert');
const createHttpError = require('http-errors');
const balancesUseCase = require('../../usecases/balances');

const depositClient = async (req, res, next) => {
  try {
    const { profile } = req;
    const { userId } = req.params;
    const { amount } = req.body;
    assert(amount, createHttpError.BadRequest('Amount can not be empty'));
    const contracts = await balancesUseCase.deposit({ profile, userId, amount: Number(amount) });
    res.status(200).json(contracts).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  depositClient,
};
