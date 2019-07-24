const { Router } = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

module.exports = Router()
  .get('/popular', (req, res, next) => {
    Post
      .getPopularUsersByComments()
      .then(users => res.send(users))
      .catch(next);
  })
  .get('/prolific', (req, res, next) => {
    Post
      .getUsersByMostPosts()
      .then(usersWithPostCount => res.send(usersWithPostCount))
      .catch(next);
  })
  .get('/leader', (req, res, next) => {
    Comment
      .getUsersByMostComments()
      .then(users => res.send(users))
      .catch(next);
  })
  .get('/impact', (req, res, next) => {
    Comment
      .getUsersByAvgComments()
      .then(users => res.send(users))
      .catch(next);
  });
