const User = require('../models/user');
// const { errorHandler } = require('../utils/err');
const { log, logError, logNow } = require('../utils/log');
// const { APIError } = require('../utils/BaseError');
// const { HttpStatusCode } = require('../utils/HttpStatusCode');

// eslint-disable-next-line consistent-return
const createUser = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const response = await res.status(200).send({ data: user });
    return response;
  } catch (error) {
    logError(error);
    // errorHandler(error);
    return res.status(500).send({ message: error.message });
  }
};

// eslint-disable-next-line consistent-return
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const response = await res.send({ users });
    return response;
  } catch (error) {
    logError(error);
    res.send({ message: error.message });
  }
};

// eslint-disable-next-line consistent-return
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const response = await res.status(200).send({ data: user });
    return response;
  } catch (error) {
    log(error);
    logError(error);
    res.status(400).send({ message: 'Bad Request' });
  }
};

function updateUser(req, res) {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((user) => {
      log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      logError(err);
      // res.send({ [err.name]: err.message });
    });
}

function updateAvatar(req, res) {
  const { _id } = req.user;
  logNow(req.user);
  log(req.body);
  User.findByIdAndUpdate(_id, req.body, { new: true })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      // errorHandler(err);
      res.status(500).send({ [err.name]: err.message });
    });
}
//
module.exports = {
  createUser, getUsers, getUserById, updateUser, updateAvatar,
};

//   User.create({ ...req.body })
// .then((user) => {
//   log(user);
//   res.status(200).send({ data: user });
// })
// .catch((err) => {
//   logError(err);
//   res.send({ message: err.message });
// });

// function findUser(req, res) {
//   User.findById(req.params.id)
//     .then((user) => {
//       log(user);
//       res.send({ data: user });
//     })
//     .catch((err) => {
//       logError(err);
//       res.send({ [err.name]: err.message });
//     });
// }
