const User = require('../models/user');
const { logError, logNow } = require('../utils/log');

module.exports.createUser = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const response = await res.status(200).send({ data: user });
    return response;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const path = /`\w+`/gi;
      return res.send({ message: `Ошибка валидации данных: ${error.message.match(path)}` });
    }
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
      return res.status(404).json({ message: `Пользователь с id ${req.params.id} не найден` });
    }
    const response = await res.send({ data: user });
    return response;
  } catch (error) {
    logError(error);
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректный запрос' });
    }
    return res.status(500).send({ message: 'Тут что-то не так' });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    logNow('reg.body: ', req.body);
    const response = await res.send({ data: user });
    return response;
  } catch (error) {
    logNow(error.name);
    if (error.name === 'ValidationError') {
      const path = /`\w+`/gi;
      return res.send({ message: `Ошибка валидации данных: ${error.message.match(path)}` });
    }

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректный запрос' });
    }

    return res.status(500).send({ message: 'Тут что-то не так' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    const response = await res.status(200).send({ data: user });
    return response;
  } catch (error) {
    logNow(error.name);
    if (error.name === 'ValidationError') {
      const path = /`\w+`/gi;
      return res.send({ message: `Ошибка валидации данных: ${error.message.match(path)}` });
    }
    return res.status(500).send({ message: 'Тут что-то не так' });
  }
};
