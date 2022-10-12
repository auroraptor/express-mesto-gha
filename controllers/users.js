const User = require('../models/user');

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

const createUser = (req, res) => {
  log(req.body);

  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUsers = (req, res) => {
  log('let\'s do this thing');
  return User.find({})
    .then((users) => {
      log('don\'t you know');
      log(users);
      res.send({ users });
    })
    .catch((err) => {
      log('let\'s not and say we did');
      res.send({ message: err.message });
    })
    .finally(() => log('don\'t you say it\'s over'));
};

// async function testAsyncGetUsers(req, res) {
//   try {
//     log('let\'s do this thing');
//     getUsers(req, res);
//   } catch (err) {
//     log(err.message);
//   }
//   log('don\'t you say it\'s over');
// }

module.exports = { createUser, getUsers };
