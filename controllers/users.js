const User = require('../models/user')

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

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({data: users})
    })
    .catch(err => checkErr(err, res))
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.send({data: user})
    })
    .catch(err => checkErr(err, res))
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({data: user})
    })
    .catch(err => checkErr(err, res))
}

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body
  const creatorId = req.user._id

  User.findByIdAndUpdate(creatorId, {name, about}, {
    new: true,
    runValidators: true
  })
    .then((user) => {
      res.send({data: user})
    })
    .catch(err => checkErr(err, res))
}

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  const creatorId = req.user._id

  User.findByIdAndUpdate(creatorId, {avatar}, {
    new: true,
    runValidators: true
  })
    .then((user) => {
      res.send({data: user})
    })
    .catch(err => checkErr(err, res))
}
