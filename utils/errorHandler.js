const HttpStatusCode = require('./HttpStatusCode');

module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === HttpStatusCode.INTERNAL_SERVER
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};
