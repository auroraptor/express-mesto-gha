const router = require('express').Router();
const {
  getUsers, createUser, getUserById, updateAvatar, updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
