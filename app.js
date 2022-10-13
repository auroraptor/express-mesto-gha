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
    _id: '6346c7bbb3b354c86cad4d99',
  };

  next();
});

app.use('/', router);

app.listen(PORT, () => {
  logNow(`App listening on port ${PORT}`);
});
