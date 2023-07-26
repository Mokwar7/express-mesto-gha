const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotCorrectTokenError = require('../utils/notCorrectTokenError');
const NotCorrectDataError = require('../utils/notCorrectDataError');
const AlreadyUsedError = require('../utils/alreadyUsedError');
const NotFindError = require('../utils/notFindError');
const {
  SUCCESS_CODE,
  CREATE_CODE,
} = require('../utils/codes');

const checkErr = (err, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new NotCorrectDataError(`Data validation error: ${err.message}`));
    return;
  }
  if (err.code === 11000) {
    next(new AlreadyUsedError('User with this email already exist'));
    return;
  }
  next(err);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(SUCCESS_CODE).send({ data: users });
    })
    .catch((err) => { checkErr(err, next); });
};

module.exports.getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new NotCorrectDataError(`Data validation error: ${err.message}`));
        return;
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new NotFindError('User is not found'))
    .then((user) => {
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    password,
    email,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        password: hash,
        email,
      })
        .then((user) => {
          // eslint-disable-next-line no-shadow
          const {
            email,
            name,
            about,
            avatar,
          } = user;
          res
            .status(CREATE_CODE)
            .send({
              email,
              name,
              about,
              avatar,
            });
        })
        .catch((err) => { checkErr(err, next); });
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const creatorId = req.user._id;

  User.findByIdAndUpdate(creatorId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => { checkErr(err, next); });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const creatorId = req.user._id;

  User.findByIdAndUpdate(creatorId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => { checkErr(err, next); });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: 3600 * 24 * 7 },
      );

      if (!token) {
        throw new NotCorrectTokenError('Ваш токен некорректный');
      }

      res
        .cookie('jwt', token, {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'авторизация прошла успешно' });
    })
    .catch(next);
};
