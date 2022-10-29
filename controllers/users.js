const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { HTTP401Error } = require('../errors/HTTP401Error');
const { HTTP409Error } = require('../errors/HTTP409Error');
const { HTTP404Error } = require('../errors/HTTP404Error');

module.exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 17); // 𓃦 ⑰ ♡
    const user = await User.create({ ...req.body, password: hash });
    const {
      name, about, avatar, _id,
    } = user;
    res.status(HttpStatusCode.OK).send({
      name, about, avatar, _id,
    });
  } catch (error) {
    if (error.name === 'MongoServerError' || error.message.includes('11000')) {
      next(new HTTP409Error(`${req.body.email} уже зарегестрирован`));
      return;
    }
    next(error);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new HTTP404Error(`Пользователь с id ${req.user._id} не найден`));
      return;
    }
    res.status(HttpStatusCode.OK).send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      next(new HTTP404Error(`Пользователь с id ${req.params.id} не найден`));
      return;
    }
    res.send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send({ ...req.body });
  } catch (error) {
    next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(HttpStatusCode.OK).send({ ...req.body });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new HTTP401Error('Неправильные почта или пароль'));
      return;
    }
    const matched = bcrypt.compare(password, user.password);
    if (!matched) {
      next(new HTTP401Error('Неправильные почта или пароль'));
      return;
    }
    const token = jwt.sign({ _id: user._id }, '🔐', { expiresIn: '7d' });
    res.status(HttpStatusCode.OK).cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ message: 'Этот токен безопасно сохранен в httpOnly куку' }).end();
  } catch (error) {
    next(error);
  }
};
