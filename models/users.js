const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const NotCorrectTokenError = require('../utils/notCorrectTokenError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (data) => validator.isEmail(data),
      message: 'Please enter valid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (data) => {
        const regex = /^(http|ftp|https)?(\:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^!=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])+$/gmi; // eslint-disable-line no-useless-escape
        return regex.test(data);
      },
      message: 'Это не ссылка',
    },
  },
}, { versionKey: '' });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotCorrectTokenError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotCorrectTokenError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
