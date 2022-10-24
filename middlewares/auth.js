const jwt = require('jsonwebtoken');
const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { log } = require('../utils/log');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    return res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, '🔐');
  } catch (err) {
    return res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  log('payload: ', payload);
  log('[BEFORE CHANGE] ', req.user);
  req.user = payload;
  log('[THE RESULT IS] ', req.user);
  return next();
};

// Если с токеном что-то не так, мидлвэр должен вернуть ошибку 401;
