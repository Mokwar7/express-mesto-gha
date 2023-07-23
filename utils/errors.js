const SUCCESS_CODE = 200;
const CREATE_CODE = 201;

class NotCorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  };
};

class NotCorrectTokenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  };
};

class NotFindError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  };
};

class AlreadyUsedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  };
};

class DefaultError extends Error {
  constructor() {
    super();
    this.message = 'Ошибка сервера';
    this.statusCode = 500;
  };
};

module.exports = {
  NotCorrectDataError,
  NotFindError,
  DefaultError,
  NotCorrectTokenError,
  AlreadyUsedError,
  SUCCESS_CODE,
  CREATE_CODE,
};