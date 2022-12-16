const dayjs = require('dayjs');
const adminRepository = require('../../infrastructure/database/repository/admin.repository');

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

const getBestPayers = async ({ startDate, endDate, limit }) => {
  const startDateFormatted = (startDate && dayjs(startDate).format(timeFormat)) || dayjs().toISOString();
  const endDateFormatted = (endDate && dayjs(endDate).format(timeFormat)) || dayjs().toISOString();

  const bestPayers = await adminRepository.getBestPayers(startDateFormatted, endDateFormatted, limit);
  return bestPayers.map((payers) => ({
    id: payers.id,
    fullName: `${payers.firstName} ${payers.lastName}`,
    paid: payers.totalPaid,
  }));
};

module.exports = getBestPayers;
