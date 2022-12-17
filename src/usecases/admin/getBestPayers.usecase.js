const dayjs = require('dayjs');
const adminRepository = require('../../infrastructure/database/repository/admin.repository');

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

const getBestPayers = async ({ startDate, endDate, limit }) => {
  // In order to accept any kind of dates format
  const startDateFormatted = (startDate && dayjs(startDate).format(timeFormat)) || dayjs().format(timeFormat);
  const endDateFormatted = (endDate && dayjs(endDate).format(timeFormat)) || dayjs().format(timeFormat);

  console.log(`Method: getBestPayers - Getting the best payers from: ${startDateFormatted} to: ${endDateFormatted}`);

  const bestPayers = await adminRepository.getBestPayers(startDateFormatted, endDateFormatted, limit);
  return bestPayers.map((payers) => ({
    id: payers.id,
    fullName: `${payers.firstName} ${payers.lastName}`,
    paid: payers.totalPaid,
  }));
};

module.exports = getBestPayers;
