const adminUseCase = require('../../usecases/admin');

const getBestProfession = async (req, res, next) => {
  try {
    const { start: startDate, end: endDate } = req.query;
    const bestProfession = await adminUseCase.getBestProfession({ startDate, endDate });
    res.status(200).json(bestProfession).end();
  } catch (error) {
    next(error);
  }
};

const getBestPayers = async (req, res, next) => {
  try {
    const { start: startDate, end: endDate, limit } = req.query;
    const bestProfession = await adminUseCase.getBestPayers({ startDate, endDate, limit });
    res.status(200).json(bestProfession).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBestProfession,
  getBestPayers,
};
