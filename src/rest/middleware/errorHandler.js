/* eslint-disable no-unused-vars */
const errorHandler = ((err, _req, res, _next) => {
  const error = {
    status: (err.status) ? err.status : 500,
    message: (err.message && err.status !== 500) ? err.message : 'Internal Server Error',
  };

  res.status(error.status).json({ message: error.message });
});

module.exports = errorHandler;
