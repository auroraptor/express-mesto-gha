const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { logNow, logError } = require('./utils/log');
const { url, password } = require('./utils/regexps');
const { errorHandler } = require('./middlewares/errorHandler');
const { HTTP404Error } = require('./errors/HTTP404Error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', { autoIndex: true })
  .then(() => logNow('Connected to the server'))
  .catch((err) => logError(err));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(password).required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(url),
    email: Joi.string().required().email(),
    password: Joi.string().pattern(password).required().min(8),
  }),
}), createUser);

app.use('/', auth, router);

app.use('*', (req, res, next) => {
  next(new HTTP404Error(`По адресу ${req.baseUrl} ничего не нашлось`));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  logNow(`App listening on port ${PORT}`);
});
