const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('Неправильные почта или пароль.');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new Error('Неправильные почта или пароль.');
    }
    return user;
  } catch (err) {
    return err;
  }
};

module.exports = mongoose.model('user', userSchema);
