const jwt = require('jsonwebtoken');
const { HTTP401Error } = require('../errors/HTTP401Error');
const { HTTP403Error } = require('../errors/HTTP403Error');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    throw new HTTP401Error('Необходима авторизация');
    // return;
  }
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, '🔐');
  } catch (err) {
    throw new HTTP403Error('C токеном что-то не так');
    // return;
  }
  req.user = payload;
  next();
};
