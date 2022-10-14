/* eslint-disable max-len */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const router = require('./routes');
const { log, logNow, logError } = require('./utils/log');
// const { HTTP404Error } = require('./utils/BaseError');
const { errorsHandler } = require('./utils/errorHandler');
const { Error404 } = require('./utils/BaseError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => logNow('Connected to the server'))
  .catch((err) => logError(err));

app.use((req, res, next) => {
  req.user = {
    _id: '6347e78a57b8f6544168e2e3',
  };

  next();
});

app.use('/', router);

// app.use(errorHandler);

// Обработаем некорректный маршрут и вернём ошибку 404
app.use('*', (req, res, next) => {
  // eslint-disable-next-line no-undef
  log(req);
  // eslint-disable-next-line no-undef
  log('there');
  next(new Error404(`Страницы по адресу ${req.baseUrl} не существует`));
});

app.use(errorsHandler);

app.listen(PORT, () => {
  logNow(`App listening on port ${PORT}`);
});

// process.on('uncaughtException', (err, origin) => {
//   // eslint-disable-next-line no-undef, max-len
//   logNow(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
// });

// // Выбросим синхронную ошибку
// throw new Error('🤭');
