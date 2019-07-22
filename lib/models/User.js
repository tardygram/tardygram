const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  profilePhotoUrl: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
    }
  }
});

userSchema.virtual('password').set(function(clearPassword) {
  this.passwordHash = bcrypt.hashSync(clearPassword);
});

userSchema.methods.authToken = function() {
  const token = jwt.sign(this.toJSON(),  process.env.APP_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = mongoose.model('User', userSchema);
