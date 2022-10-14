const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
// const { errorHandler } = require('../utils/errorHandler');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
