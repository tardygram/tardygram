const { Router } = require('express');
// const User = require('../models/User');
const Comment = require('../models/Comment');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      post,
      comment
    } = req.body;

    Comment
      .create({
        commentBy: req.user._id,
        post,
        comment
      })
      .then(comment => {
        res.send(comment);
      })
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Comment
      .findById(req.params.id)
      .then(comment => {
        if(comment.commentBy.toString() !== req.user._id.toString()) {
          const err = new Error('User does not match comment user');
          err.status = 401;
          err.suppress = true;
          return next(err);
        }

        Comment
          .findByIdAndDelete(req.params.id)
          .then(comment => res.send(comment));
      })
      .catch(next);
  });
