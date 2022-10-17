const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const router = require('./routes');
const { logNow, logError } = require('./utils/log');
const { logger } = require('./utils/logger');
const { hardCodedUserId } = require('./utils/hardCodedUserId');
const { HttpStatusCode } = require('./utils/HttpStatusCode');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => logNow('Connected to the server'))
  .catch((err) => logError(err));

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger(logger));

app.use(hardCodedUserId);

app.use('/', router);

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger(logger));

app.use('*', (req, res) => {
  res.status(HttpStatusCode.NOT_FOUND).send({ message: `По адресу ${req.baseUrl} ничего не нашлось` });
});

// app.use(errorHandler);

app.listen(PORT, () => {
  logNow(`App listening on port ${PORT}`);
});
