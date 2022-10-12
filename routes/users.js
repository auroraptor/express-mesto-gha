const router = require('express').Router();
const { getUsers, createUser } = require('../controllers/users');
const User = require('../models/user');

router.get('/users', getUsers);
// router.get('/users', testAsyncGetUsers);

router.get('/users/:id', (res, req) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.send({ message: err.message }));
});

router.post('/users', createUser);

module.exports = router;
