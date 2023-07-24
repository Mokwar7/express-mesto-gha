const Cards = require('../models/cards');
const NotCorrectDataError = require('../utils/notCorrectDataError');
const NotFindError = require('../utils/notFindError');
const DefaultError = require('../utils/defaultError');
const {
  SUCCESS_CODE,
  CREATE_CODE,
} = require('../utils/codes');

const checkErr = (err, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new NotCorrectDataError(`Data validation error: ${err.message}`));
    return;
  }
  if (err.name === 'DocumentNotFoundError') {
    next(new NotFindError(`Invalid ID: ${err.message}`));
    return;
  }

  next(new DefaultError(`Invalid ID: ${err.message}`));
};

module.exports.getAllCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => {
      res.status(SUCCESS_CODE).send({ data: cards });
    })
    .catch((err) => { checkErr(err, res, next); });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Cards.create({ name, link, owner: _id })
    .then((card) => {
      res.status(CREATE_CODE).send({ data: card });
    })
    .catch((err) => { checkErr(err, res, next); });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Cards.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFindError('Card is not found');
      }
      if (card.owner._id !== _id) {
        return Promise.reject(new Error('Вы не владелец карточки'));
      }
      return Cards.findByIdAndDelete(cardId)
        .then((result) => {
          res.status(SUCCESS_CODE).send({ data: result });
        })
        .catch((err) => { checkErr(err, res, next); });
    })
    .catch((err) => { checkErr(err, res, next); });
};

module.exports.putLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Cards.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, {
    new: true,
  })
    .orFail()
    .then((result) => {
      res.status(SUCCESS_CODE).send({ data: result });
    })
    .catch((err) => { checkErr(err, res, next); });
};

module.exports.deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Cards.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, {
    new: true,
  })
    .orFail()
    .then((result) => {
      res.status(SUCCESS_CODE).send({ data: result });
    })
    .catch((err) => { checkErr(err, res, next); });
};
