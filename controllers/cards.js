const Cards = require('../models/card')

const checkErr = (err, res) => {
  if (err.name === ("ValidationError" || "CastError")) {
    res.status(400).send(`Data validation error: ${err.message}`);
    return;
  }
  if (err.message === "InvalidId") {
    res.status(404).send(`Invalid ID`);
    return;
  }

  res.status(500).send(`Server error: ${err.message}`);
}

module.exports.getAllCards = (req, res) => {
  Cards.find({})
    .then((cards) => {
      res.send({data: cards})
    })
    .catch(err => checkErr(err, res))
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body
  const creatorId = req.user._id

  Cards.create({name, link, owner: creatorId})
    .then((card) => {
      res.send({data: card})
    })
    .catch(err => checkErr(err, res))
}

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params

  Cards.findByIdAndDelete(cardId)
    .then((result) => {
      res.send({data: result})
    })
    .catch(err => checkErr(err, res))
}

module.exports.putLike = (req, res) => {
  const { cardId } = req.params
  const creatorId = req.user._id

  Cards.findByIdAndUpdate(cardId, { $addToSet: { likes: creatorId }}, {
    new: true,
    runValidators: true
  })
    .then((result) => {
      res.send({data: result})
    })
    .catch(err => checkErr(err, res))
}

module.exports.deleteLike = (req, res) => {
  const { cardId } = req.params
  const creatorId = req.user._id

  Cards.findByIdAndUpdate(cardId, { $pull: {likes: creatorId }}, {
    new: true,
    runValidators: true
  })
    .then((result) => {
      res.send({data: result})
    })
    .catch(err => checkErr(err, res))
}
