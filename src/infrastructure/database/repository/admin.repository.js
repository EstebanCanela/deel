const { QueryTypes } = require('sequelize');
const { sequelize } = require('../model');

const DEFAULT_BEST_PAYERS_LIMIT = 2;

const getBestProfession = async (startDate, endDate) => {
  const bestProfession = await sequelize.query(
    `
          SELECT "profession", SUM("price") AS "earned"
          FROM "Jobs"
          INNER JOIN "Contracts" ON "Jobs"."ContractId" = "Contracts"."id"
          INNER JOIN "Profiles" ON "Contracts"."ContractorId" = "Profiles"."id"
          WHERE "Jobs"."paid" = true
          AND "Jobs"."paymentDate" BETWEEN :startDate AND :endDate
          GROUP BY "profession"
          ORDER BY "earned" DESC
          LIMIT 1;
      `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        startDate,
        endDate,
      },
    },
  );
  return bestProfession;
};

const getBestPayers = async (
  startDate,
  endDate,
  limit = DEFAULT_BEST_PAYERS_LIMIT,
) => {
  const bestPayers = await sequelize.query(
    `
        SELECT "clientId" AS "id", "firstName", "lastName", SUM("price") AS "totalPaid"
        FROM "Jobs"
        INNER JOIN "Contracts" ON "Jobs"."contractId" = "Contracts"."id"
        INNER JOIN "Profiles" ON "Contracts"."clientId" = "Profiles"."id"
        WHERE "Jobs"."paid" = true
        AND "Jobs"."paymentDate" BETWEEN :startDate AND :endDate
        GROUP BY "clientId"
        ORDER BY "totalPaid" DESC
        LIMIT :limit
    `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        startDate,
        endDate,
        limit,
      },
    },
  );
  return bestPayers;
};

module.exports = {
  getBestProfession,
  getBestPayers,
};
