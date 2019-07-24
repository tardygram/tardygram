const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router()
  .get('/popular', (req, res, next) => {
    Post
      .getPopularUsersByComments()
      .then(users => res.send(users))
      .catch(next);
  });
