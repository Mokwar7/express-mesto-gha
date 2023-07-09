const Cards = require('../models/card');
const {
  NOT_CORRECT_DATA_ERROR_CODE,
  NOT_FIND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  SUCCESS_CODE,
  CREATE_CODE,
} = require('../utils/errorCodes');

const checkErr = (err, res) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(NOT_CORRECT_DATA_ERROR_CODE).send({ message: `Data validation error: ${err.message}` });
    return;
  }
  if (err.name === 'DocumentNotFoundError') {
    res.status(NOT_FIND_ERROR_CODE).send({ message: `Invalid ID: ${err.message}` });
    return;
  }

  res.status(DEFAULT_ERROR_CODE).send({ message: `Server error: ${err.message}` });
};

module.exports.getAllCards = (req, res) => {
  Cards.find({})
    .then((cards) => {
      res.status(SUCCESS_CODE).send({ data: cards });
    })
    .catch((err) => {checkErr(err, res)});
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const creatorId = req.user._id;

  Cards.create({name, link, owner: creatorId})
    .then((card) => {
      res.status(CREATE_CODE).send({ data: card });
    })
    .catch((err) => {checkErr(err, res)});
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndRemove(cardId)
    .orFail()
    .then((result) => {
      res.status(SUCCESS_CODE).send({ data: result });
    })
    .catch((err) => {checkErr(err, res)});
};

module.exports.putLike = (req, res) => {
  const { cardId } = req.params;
  const creatorId = req.user._id;

  Cards.findByIdAndUpdate(cardId, { $addToSet: { likes: creatorId }}, {
    new: true,
  })
    .orFail()
    .then((result) => {
      res.status(SUCCESS_CODE).send({ data: result });
    })
    .catch((err) => {checkErr(err, res)});
};

module.exports.deleteLike = (req, res) => {
  const { cardId } = req.params;
  const creatorId = req.user._id;

  Cards.findByIdAndUpdate(cardId, { $pull: { likes: creatorId }}, {
    new: true,
  })
    .orFail()
    .then((result) => {
      res.status(SUCCESS_CODE).send({ data: result })
    })
    .catch((err) => {checkErr(err, res)});
};
