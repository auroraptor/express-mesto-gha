const { HttpStatusCode } = require('../utils/HttpStatusCode');

class APIError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HttpStatusCode.INTERNAL_SERVER;
  }
}

module.exports = { APIError };
