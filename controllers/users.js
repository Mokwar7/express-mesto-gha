const User = require('../models/user');
const {
  NOT_CORRECT_DATA_ERROR_CODE,
  NOT_FIND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  SUCCESS_CODE,
  CREATE_CODE,
} = require('../utils/errorCodes');
const checkErr = (err, res) => {
  if (err.name === "CastError" || err.name === "ValidationError") {
    res.status(NOT_CORRECT_DATA_ERROR_CODE).send({message: `Data validation error: ${err.message}`});
    return;
  }
  if (err.name === "DocumentNotFoundError") {
    res.status(NOT_FIND_ERROR_CODE).send({message: `Invalid ID: ${err.message}`});
    return;
  }

  res.status(DEFAULT_ERROR_CODE).send({message: `Server error: ${err.message}`});
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(SUCCESS_CODE).send({data: users})
    })
    .catch(err => checkErr(err, res));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.status(SUCCESS_CODE).send({data: user})
    })
    .catch(err => checkErr(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATE_CODE).send({data: user})
    })
    .catch(err => checkErr(err, res));
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const creatorId = req.user._id;

  User.findByIdAndUpdate(creatorId, {name, about}, {
    new: true,
    runValidators: true
  })
    .then((user) => {
      res.status(SUCCESS_CODE).send({data: user})
    })
    .catch(err => checkErr(err, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const creatorId = req.user._id;

  User.findByIdAndUpdate(creatorId, {avatar}, {
    new: true,
    runValidators: true
  })
    .then((user) => {
      res.status(SUCCESS_CODE).send({data: user})
    })
    .catch(err => checkErr(err, res));
};
