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
  });
