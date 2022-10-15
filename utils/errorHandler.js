// const { log, logError } = require('./log');

// function errorHandler(error, request, response, next) {
//   log('here we are');
//   logError(error);
//   if (error.httpCode === 404) {
//     const status = 404;
//     const message = 'Not Found';

//     response.status(status).json({ message });

//     return;
//   }

//   if (error.httpCode === 400) {
//     const status = 400;
//     const message = 'Bad syntax';

//     response.status(status).json({ message });

//     return;
//   }

//   const status = error.statusCode || error.code || 500;
//   const message = error.message || 'internal error';
//   // eslint-disable-next-line no-undef
//   log(response);

//   response.status(status).json({ status, message });
//   next();
// }

// module.exports = {
//   errorHandler,
// };

const errorsHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = { errorsHandler };
