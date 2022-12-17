const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;

const ApplicationError = require('../../../src/common/errors/Application.error');

chai.use(chaiAsPromised);

const sequelize = {
  transaction: () => Promise.resolve({
    LOCK: {
      UPDATE: 'update',
    },
    commit: () => Promise.resolve(),
    rollback: () => Promise.resolve(),
  }),
};

const clientSenderProfile = {
  type: 'client',
  id: 1,
};

const receiverProfile = {
  id: 2,
  balance: 200,
};
const getProfileById = sinon.stub().resolves(receiverProfile);

describe('Test Deposit Client Use Case', async () => {
  afterEach(() => {
    sinon.restore();
    getProfileById.reset();
  });

  it('Deposit amount is lower than deposit threshold', async () => {
    // GIVEN
    const amountToDeposit = 20;
    const totalPriceJobsInProgress = 400;
    const updateBalanceOk = sinon.stub().resolves({
      ...receiverProfile,
      balance: receiverProfile.balance + amountToDeposit,
    });
    const getTotalPriceJobInProgressByClient = sinon.stub().resolves(totalPriceJobsInProgress);

    const deposit = proxyquire('../../../src/usecases/balances/depositClient.usecase', {
      '../../infrastructure/database/repository/job.repository': {
        getTotalPriceJobInProgressByClient,
      },
      '../../infrastructure/database/repository/profile.repository': {
        getProfileById,
        updateBalance: updateBalanceOk,
      },
      '../../infrastructure/database/model': {
        sequelize,
      },
    });

    // WHEN
    const result = await deposit({ profile: clientSenderProfile, userId: receiverProfile.id, amount: amountToDeposit });

    // THEN
    chai.expect(result.balance).to.be.eql(receiverProfile.balance + amountToDeposit);
    chai.expect(getProfileById.firstCall.args[0]).to.be.eql(receiverProfile.id);
    chai.expect(updateBalanceOk.firstCall.args[0]).to.be.eql(receiverProfile.id);
    chai.expect(updateBalanceOk.firstCall.args[1]).to.be.eql(amountToDeposit);
  });

  it('Deposit amount is greater than deposit threshold', async () => {
    // GIVEN
    const amountToDeposit = 200;
    const totalPriceJobsInProgress = 40;
    const getTotalPriceJobInProgressByClient = sinon.stub().resolves(totalPriceJobsInProgress);

    const deposit = proxyquire('../../../src/usecases/balances/depositClient.usecase', {
      '../../infrastructure/database/repository/job.repository': {
        getTotalPriceJobInProgressByClient,
      },
      '../../infrastructure/database/repository/profile.repository': {
        getProfileById: null,
        updateBalance: null,
      },
      '../../infrastructure/database/model': {
        sequelize,
      },
    });

    // THEN
    await expect(deposit({ profile: clientSenderProfile, userId: receiverProfile.id, amount: amountToDeposit })).to.be.rejectedWith(ApplicationError);
  });

  it('Receiver Profile Not Found', async () => {
    // GIVEN
    const amountToDeposit = 20;
    const totalPriceJobsInProgress = 400;
    const getTotalPriceJobInProgressByClient = sinon.stub().resolves(totalPriceJobsInProgress);

    const deposit = proxyquire('../../../src/usecases/balances/depositClient.usecase', {
      '../../infrastructure/database/repository/job.repository': {
        getTotalPriceJobInProgressByClient,
      },
      '../../infrastructure/database/repository/profile.repository': {
        getProfileById: sinon.fake.resolves(null),
        updateBalance: null,
      },
      '../../infrastructure/database/model': {
        sequelize,
      },
    });

    // THEN
    await expect(deposit({ profile: clientSenderProfile, userId: receiverProfile.id, amount: amountToDeposit })).to.be.rejectedWith(ApplicationError);
  });
});
