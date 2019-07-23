const { Router } = require('express');
// const User = require('../models/User');
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      user,
      photoUrl,
      caption,
      tags
    } = req.body;

    Post
      .create({
        user,
        photoUrl,
        caption,
        tags
      })
      .then(post => res.send(post))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Post
      .findById(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  });
