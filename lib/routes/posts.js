const { Router } = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ensureAuth = require('../middleware/ensure-auth');
// const mongoose = require('mongoose');

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
  .get('/popular', (req, res, next) => {
    Comment
      .getPostsByMostComments()
      .then(posts => res.send(posts))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Promise.all([
      Post
        .findById(req.params.id)
        .populate('user'),
      Comment
        .find({ post: req.params.id })
    ])
      .then(([post, comments]) => res.send({ ...post.toJSON(), comments }))
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
