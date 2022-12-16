const { Profile } = require('../model');

const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

const executeBalanceOperation = {
  [INCREASE]: (a, b) => a + b,
  [DECREASE]: (a, b) => a - b,
};

const updateBalance = async (profileId, price, operationType, options) => {
  const profile = await Profile.findOne({ where: { id: profileId } });
  const totalBalance = profile.get('balance');
  const newTotalBalance = executeBalanceOperation[operationType](totalBalance, price);
  profile.set({
    balance: newTotalBalance,
  });
  return profile.save({ ...options });
};

const getProfileById = async (profileId, options) => Profile.findByPk(profileId, options);

module.exports = {
  updateBalance,
  getProfileById,
  INCREASE,
  DECREASE,
};
