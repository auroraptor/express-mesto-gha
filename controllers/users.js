const { HTTP400Error } = require('../errors/HTTP400Error');
const { HTTP404Error } = require('../errors/HTTP404Error');
const { APIError } = require('../errors/APIError');
const User = require('../models/user');
const { logError, logNow } = require('../utils/log');

const handleValidationError = (error, req, res) => {
  logNow(error.name);
  if (error.name === 'ValidationError') {
    const path = /`\w+`/gi;
    return res.send({ message: `Ошибка валидации данных: ${error.message.match(path)}` });
    // next(new HTTP404Error(`Ошибка валидации данных: ${error.message.match(path)}`));
  }
  return error;
};

const handleCastError = (error, req, res) => {
  logNow(error.name);
  if (error.name === 'CastError') {
    return res.status(400).send({ message: 'Некорректный запрос' });
  }
  return error;
};

const handleNotFoudError = (req, res) => res.status(404).json({ message: `Пользователь с id ${req.params.id} не найден` });

module.exports.createUser = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const response = await res.status(200).send({ data: user });
    return response;
  } catch (error) {
    handleValidationError(error, req, res);
    return res.status(500).send({ message: 'Тут что-то не так' });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const response = await res.send({ users });
    return response;
  } catch (error) {
    logError(error);
    return res.status(500).send({ message: 'Тут что-то не так' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      handleNotFoudError(req, res);
    }
    const response = await res.status(200).send({ data: user });
    return response;
  } catch (error) {
    logError(error);
    return handleCastError(error, req, res);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    if (user === null) {
      handleNotFoudError(req, res);
    }
    const response = await res.status(200).send({ data: user });
    return response;
  } catch (error) {
    logNow(error.name);
    handleValidationError(error, req, res);
    handleCastError(error, req, res);
    return res.status(500).send({ message: 'Тут что-то не так' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
    const response = await res.status(200).send({ data: user });
    return response;
  } catch (error) {
    logNow(error.name);
    const path = /`\w+`/gi;
    if (error.name === 'ValidationError') {
      return res.send({ message: new HTTP400Error(`Ошибка валидации данных: ${error.message.match(path)}`).message });
    }
    return res.status(500).send({ message: new APIError('Что-то не так').message });
  }
};
