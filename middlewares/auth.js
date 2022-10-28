const jwt = require('jsonwebtoken');
const { HttpStatusCode } = require('../utils/HttpStatusCode');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, '🔐');
  } catch (err) {
    res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
