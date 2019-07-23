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
  .get('/:id', (req, res, next) => {
    Post
      .findById(req.params.id)
      .populate('user')
      .then(post => res.send(post))
      .catch(next);
  })
  .get('/', (req, res, next) => {
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
      caption,
    } = req.body;

    Post
      .findById(id)
      .then(post => {
        if(post.user.toString() !== req.user._id.toString()) {
          const err = new Error('You are not logged in as the correct user');
          err.status = 401;
          err.suppress = true;
          next(err);
        }

        Post
          .findByIdAndUpdate(id, { caption }, { new: true })
          .then(post => {
            res.send(post);
          })
          .catch(next);
      });
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Post
      .findById(req.params.id)
      .then(post => {
        if(post.user.toString() !== req.user._id.toString()) {
          const err = new Error('You are not logged in as the correct user');
          err.status = 401;
          err.suppress = true;
          next(err);
        }

        Post
          .findByIdAndDelete(req.params.id)
          .then(post => res.send(post))
          .catch(next);
      });

  });
