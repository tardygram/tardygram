const { Router } = require('express');
// const User = require('../models/User');
const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      photoUrl,
      caption,
      tags
    } = req.body;

    Post
      .create({
        photoUrl,
        caption,
        tags,
        user: req.user._id
      })
      .then(post => res.send(post))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Post
      .findById(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  })
  .get('/', ensureAuth, (req, res, next) => {
    Post
      .find()
      .then(posts => {
        res.send(posts);
      })
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    const id = req.params.id;
    const {
      photoUrl,
      caption,
      tags
    } = req.body;

    const update = {};
    if(photoUrl) update.photoUrl = photoUrl;
    if(caption) update.caption = caption;
    if(tags) update.tags = tags;

    Post
      .findByIdAndUpdate(id, update, { new: true })
      .then(post => {
        res.send(post);
      })
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Post
      .findByIdAndDelete(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  });
