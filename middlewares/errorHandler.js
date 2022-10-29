const { HttpStatusCode } = require('../utils/HttpStatusCode');

module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = HttpStatusCode.INTERNAL_SERVER, message } = err;
  res.status(statusCode).send({ message });
  next();
};
