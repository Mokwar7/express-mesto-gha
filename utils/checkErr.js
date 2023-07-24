const NotCorrectDataError = require('../utils/notCorrectDataError');
const NotFindError = require('../utils/notFindError');
const AlreadyUsedError = require('../utils/alreadyUsedError');
const DefaultError = require('../utils/defaultError');

const checkErr = (err, res, next) => {
  let error;
  if (err.name === 'CastError' || err.name === 'ValidationError' || err.name === 'Error') {
    error = new NotCorrectDataError(`Data validation error: ${err.message}`);
    res.status(error.statusCode).send({message: error.message});
    next();
    return;
  }
  if (err.name === 'DocumentNotFoundError') {
    error = new NotFindError(`Invalid ID: ${err.message}`);
    res.status(error.statusCode).send({message: error.message});
    next();
    return;
  }
  if (err.code === 11000) {
    error = new AlreadyUsedError('Данный email уже зарегестрирован');
    res.status(error.statusCode).send({message: error.message});
    next();
    return;
  }

  error = new DefaultError(`Server error: ${err.message}`);
  res.status(error.statusCode).send({message: error.message});
  next();
};

module.exports = checkErr;
