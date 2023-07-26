const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const NotCorrectTokenError = require('../utils/notCorrectTokenError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  if (!token) {
    next(new NotCorrectTokenError('Необходима авторизация'));
    return;
  }

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new NotCorrectTokenError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
