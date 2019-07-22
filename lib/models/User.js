const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
});

userSchema.virtual('password').set(function(clearPassword) {
  this.passwordHash = bcrypt.hashSync(clearPassword);
});

module.exports = mongoose.model('User', userSchema);
