class BaseError extends Error {
  constructor(name, httpCode, message) {
    super(message);
    this.name = name;
    this.statusCode = httpCode;
  }
}

module.exports = { BaseError };
