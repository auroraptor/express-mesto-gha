const { HttpStatusCode } = require('../utils/HttpStatusCode');

class HTTP400Error extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HttpStatusCode.BAD_REQUEST;
  }
}

module.exports = { HTTP400Error };
