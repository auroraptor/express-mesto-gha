const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateAvatar, updateUser, getCurrentUser,
} = require('../controllers/users');
const { url } = require('../utils/regexps');

router.get('/me', getCurrentUser);
router.get('/', getUsers);

router.get('/:id', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(url),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(url),
  }),
}), updateAvatar);

module.exports = router;
