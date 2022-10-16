const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const router = require('./routes');
const { logNow, logError } = require('./utils/log');
const { logger } = require('./utils/logger');
const { errorHandler } = require('./utils/errorHandler');
const { HttpStatusCode } = require('./utils/HttpStatusCode');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => logNow('Connected to the server'))
  .catch((err) => logError(err));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '634aa867af58fa7ff431ff6f',
//   };

//   next();
// });

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger(logger));

app.use((req, res, next) => {
  req.user = {
    _id: '634aa867af58fa7ff431ff6f', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', router);

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger(logger));

app.use('*', (req, res) => {
  res.status(HttpStatusCode.NOT_FOUND).send(`По адресу ${req.baseUrl} ничего не нашлось`);
});

app.use(errorHandler);

app.listen(PORT, () => {
  logNow(`App listening on port ${PORT}`);
});
