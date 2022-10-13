const User = require('../models/user');
const { log, logError } = require('../utils/log');

function createUser(req, res) {
  return User.create({ ...req.body })
    .then((user) => {
      log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      logError(err);
      res.send({ message: err.message });
    });
}

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      log(users);
      res.send({ users });
    })
    .catch((err) => {
      logError(err);
      res.send({ [err.name]: err.message });
    });
}

function findUser(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      logError(err);
      res.send({ [err.name]: err.message });
    });
}

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
  log(req.body);
  User.findByIdAndUpdate(_id, req.body, { new: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ [err.name]: err.message });
    });
}

module.exports = {
  createUser, getUsers, findUser, updateUser, updateAvatar,
};
