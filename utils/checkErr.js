const NotCorrectDataError = require('../utils/notCorrectDataError');
const NotCorrectTokenError = require('../utils/notCorrectTokenError')
const NotFindError = require('../utils/notFindError');
const AlreadyUsedError = require('../utils/alreadyUsedError');

const checkErr = (err, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new NotCorrectDataError(`Data validation error: ${err.message}`));
    return;
  }
  if (err.name === 'TypeError') {
    next(new NotCorrectTokenError(`Not correct data: ${err.message}`));
    return;
  }
  if (err.name === 'DocumentNotFoundError') {
    next(new NotFindError(`Invalid ID: ${err.message}`));
    return;
  }
  if (err.code === 11000) {
    next(new AlreadyUsedError('Данный email уже зарегестрирован'));
    return;
  }

  next(err);
};

module.exports = checkErr;
