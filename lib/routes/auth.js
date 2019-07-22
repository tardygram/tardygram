const { Router } = require('express');

const User = require('../models/User');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      username,
      password,
      profilePhotoUrl
    } = req.body;

    User
      .create({
        username,
        password,
        profilePhotoUrl
      })
      .then(user => {
        const token = user.authToken();

        res.cookie('session', token);
        res.send(user);
      })
      .catch(next);
  })
  .post('/signin', (req, res, next) => {
    const {
      username,
      password
    } = req.body;

    User
      .findOne({ username })
      .then(user => {
        const isValidPassword = user.compare(password);

        if(isValidPassword) {
          const token = user.authToken();
          
          res.cookie('session', token);
          res.send(user);
        } else {
          const err = new Error('Invalid username/password');
          err.status = 401;
          next(err);
        }
      })
      .catch(next);
  });
