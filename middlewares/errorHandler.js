// const HttpStatusCode = require('../utils/HttpStatusCode');

const { logNow } = require('../utils/log');

module.exports.errorHandler = (err, req, res, next) => {
  logNow(err);
  res.status(err.httpCode).send({ message: err.message });
  next();
};
