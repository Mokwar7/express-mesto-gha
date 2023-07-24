class DefaultError extends Error {
  constructor() {
    super();
    this.message = 'Ошибка сервера';
    this.statusCode = 500;
  }
}

module.exports = DefaultError;
