const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const NotCorrectTokenError = require('../utils/notCorrectTokenError')

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotCorrectTokenError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new NotCorrectTokenError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  res.send(token);

  next();
  return;
};
