const User = require('../models/user');
const { log } = require('../utils/log');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      log(err);
      res.send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      log(users);
      res.send({ users });
    })
    .catch((err) => {
      log(err.message);
      res.send({ message: err.message });
    });
};

const findUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      log(err);
      res.send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  log(_id);
  const { body } = req;
  log(body);

  User.findByIdAndUpdate(_id, body, { new: true })
    .then((user) => {
      log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      log(err);
      res.send(err.message);
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, req.body, { new: true })
    .then((user) => {
      log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      log(err);
      res.send(err.message);
    });
};

module.exports = {
  createUser, getUsers, findUser, updateUser, updateAvatar,
};
