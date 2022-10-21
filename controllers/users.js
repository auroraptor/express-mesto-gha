const validator = require('validator');
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
    const user = await User.create({ ...req.body });
    return res.status(HttpStatusCode.OK).send({ data: user });
  } catch (error) {
    logNow(error.name);
    logNow(error.message);

    if (error.name === 'ValidationError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: `Ошибка валидации данных: ${error.message.match(regex)}` });
    }

    if (error.message === '401') {
      return res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'это временное решение, которое сообщает что поле email не прошло валидацию' });
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

module.exports.getUserById = async (req, res) => {
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
