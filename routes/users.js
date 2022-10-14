const router = require('express').Router();
const {
  getUsers, createUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');
// const { log } = require('../utils/log');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
