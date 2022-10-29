const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30, // TODO
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return validator.isURL(url) === true;
      },
      message: 'Is not a valid URL',
    },
  },
  email: {
    type: mongoose.Schema.Types.String,
    require: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email) === true;
      },
      message: 'Is not a valid email address',
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
