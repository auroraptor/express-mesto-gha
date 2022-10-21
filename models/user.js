const mongoose = require('mongoose');

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
  },
  email: {
    type: mongoose.Schema.Types.String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    minlength: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
