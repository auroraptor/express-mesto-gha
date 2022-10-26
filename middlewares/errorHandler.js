const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { logNow } = require('../utils/log');

module.exports.errorHandler = (err, req, res) => {
  logNow('[HERE WE GO]');
  const { statusCode = HttpStatusCode.INTERNAL_SERVER, message = 'internal server error' } = err;

  res.status(statusCode).send({ message });
  // next();
};
