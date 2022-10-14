// eslint-disable-next-line max-classes-per-file, import/no-import-module-exports
const { HttpStatusCode } = require('./HttpStatusCode');

// eslint-disable-next-line max-classes-per-file
class BaseError extends Error {
  constructor(name, httpCode, description, isOperational) {
    super(description);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

// free to extend the BaseError
class APIError extends BaseError {
  constructor(name, httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true, description = 'internal server error') {
    super(name, httpCode, isOperational, description);
  }
}

class HTTP400Error extends BaseError {
  constructor(description = 'bad request') {
    super('NOT FOUND', HttpStatusCode.BAD_REQUEST, true, description);
  }
}

class HTTP404Error extends BaseError {
  constructor(description = 'Not Found') {
    super('NOT FOUND', HttpStatusCode.BAD_REQUEST, true, description);
  }
}

class Error404 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = { APIError, HTTP400Error, HTTP404Error, Error404,
};
