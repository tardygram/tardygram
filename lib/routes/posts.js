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
  .patch('/:id', ensureAuth, (req, res, next) => {
    const id = req.params.id;
    const {
      photoUrl,
      caption,
      tags
    } = req.body;

    Post
      .findByIdAndUpdate(id, {
        photoUrl,
        caption,
        tags
      }, { new: true })
      .then(post => {
        res.send(post);
      })
      .catch(next);
  });
