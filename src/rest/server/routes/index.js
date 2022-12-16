const contracts = require('./contracts.router');
const balances = require('./balances.router');
const jobs = require('./jobs.router');
const admin = require('./admin.router');

const bind = (app) => {
  app.use('/contracts', contracts);
  app.use('/jobs', jobs);
  app.use('/balances', balances);
  app.use('/admin', admin);
};

module.exports = {
  bind,
};
