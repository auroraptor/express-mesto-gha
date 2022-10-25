const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const regex = /`\w+`/gi;
const { logNow } = require('../utils/log');
const { HttpStatusCode } = require('../utils/HttpStatusCode');

module.exports.createUser = async (req, res) => {
  try {
    if (!validator.isEmail(req.body.email)) {
      logNow('no email');
      throw new Error('401'); // TODO пришло время создавать свои классы ошибок
    }
    const hash = await bcrypt.hash(req.body.password, 17); // 𓃦 ⑰ ♡
    const user = await User.create({ ...req.body, password: hash });
    const {
      name, about, avatar, _id,
    } = user;
    logNow('[USER]: ', user);
    logNow({
      name, about, avatar, _id,
    });
    return res.status(HttpStatusCode.OK).send({
      name, about, avatar, _id,
    });
  } catch (error) {
    logNow(error.name);
    logNow(error.message);

    if (error.name === 'ValidationError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: `Ошибка валидации данных: ${error.message.match(regex)}` });
    }

    if (error.message === '401') {
      return res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'это временное решение, которое сообщает что поле email не прошло валидацию' });
    }

    if (error.name === 'MongoServerError' || error.message.includes('11000')) {
      return res.status(HttpStatusCode.CONFLICT).send({ message: `${req.body.email} уже зарегестрирован` });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (error) {
    logNow(error.name);

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  logNow('user._id', req.user._id);
  logNow('params', req.user);
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).send({ message: `Пользователь с id ${req.user._id} не найден` });
    }
    return res.status(HttpStatusCode.OK).send(user);
  } catch (err) {
    return err;
  }
};

module.exports.getUserById = async (req, res) => {
  logNow('user._id', req.user._id);

  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: `Пользователь с id ${req.params.id} не найден` });
    }
    return res.send({ data: user });
  } catch (error) {
    logNow(error.name);

    if (error.name === 'CastError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Некорректный запрос' });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.send({ ...req.body });
  } catch (error) {
    logNow(error.name);

    if (error.name === 'ValidationError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: `Ошибка валидации данных: ${error.message.match(regex)}` });
    }

    if (error.name === 'CastError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Некорректный запрос' });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(HttpStatusCode.OK).send({ ...req.body });
  } catch (error) {
    logNow(error.name);

    if (error.name === 'ValidationError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: `Ошибка валидации данных: ${error.message.match(regex)}` });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Неправильные почта или пароль.' });
    }
    const matched = bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Неправильные почта или пароль.' });
    }
    const token = jwt.sign({ _id: user._id }, '🔐', { expiresIn: '7d' });
    return res.status(HttpStatusCode.OK).cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ message: 'Этот токен безопасно сохранен в httpOnly куку' }).end();
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};
