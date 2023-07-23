require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const { celebrate, Joi } = require('celebrate');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

const {
  login,
  createUser,
} = require('./controllers/users');

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('All is fine');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  })}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует.' });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
