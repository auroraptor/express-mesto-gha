const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const { logNow } = require('./utils/log');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => logNow('Connected to the server'))
  .catch((err) => logNow(err.message));

app.use((req, res, next) => {
  req.user = {
    _id: '6347e78a57b8f6544168e2e3',
  };

  next();
});

// app.use(errorHandler);

app.use('/', router);

app.listen(PORT, () => {
  logNow(`App listening on port ${PORT}`);
});
