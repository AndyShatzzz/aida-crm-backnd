const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { UnauthorizedError } = require('../errors/errors');
const errorMessage = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  role: {
    type: String,
    default: 'Официант',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://sun9-26.userapi.com/impg/zblbzn0DDLjYUn23kH4gxKoggF5ZrcaYXcpp0g/_L1h_-mzxrQ.jpg?size=240x240&quality=96&sign=75e27091bf4a09f67cff4865d8b73ec6&type=album',
  },
});

userSchema.statics.findUserByCredentials = function (name, password) {
  return this.findOne({ name }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(errorMessage.unauthorizedErrorMessage));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(errorMessage.unauthorizedErrorMessage));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
