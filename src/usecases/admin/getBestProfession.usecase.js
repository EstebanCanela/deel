const dayjs = require('dayjs');
const adminRepository = require('../../infrastructure/database/repository/admin.repository');
const ApplicationError = require('../../common/errors/Application.error');

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

const getBestProfession = async ({ startDate, endDate }) => {
  // In order to accept any kind of dates format
  const startDateFormatted = (startDate && dayjs(startDate).format(timeFormat)) || dayjs().format(timeFormat);
  const endDateFormatted = (endDate && dayjs(endDate).format(timeFormat)) || dayjs().format(timeFormat);

  const bestProfession = await adminRepository.getBestProfession(startDateFormatted, endDateFormatted);

  if (!bestProfession.length) {
    throw new ApplicationError('Best Profession not found for given date range', 404);
  }

  return bestProfession && bestProfession[0];
};

module.exports = getBestProfession;
