const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const router = require('./routes');
const { logNow, logError } = require('./utils/log');
const { errorHandler } = require('./utils/errorHandler');
const { logger } = require('./utils/logger');
// eslint-disable-next-line import/extensions
const { hardCodedUserId } = require('./utils/hardCodedUserId');
const { HTTP404Error } = require('./errors/HTTP404Error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => logNow('Connected to the server'))
  .catch((err) => logError(err));

app.use(hardCodedUserId);

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger(logger));

app.use('/', router);

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger(logger));

app.use('*', (req, res, next) => {
  next(new HTTP404Error(`Некорректный запрос по адресу ${req.baseUrl}`));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logNow(`App listening on port ${PORT}`);
});
