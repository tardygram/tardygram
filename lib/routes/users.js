const { Router } = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

module.exports = Router()
  .get('/prolific', (req, res, next) => {
    Post
      .aggregate([{
        '$group': { _id: '$user', count: { '$sum': 1 } }
      }, {
        '$sort': { count: -1 }
      }, {
        '$limit': 10
      }])
      .then(users => {
        console.log(users);
        users = users.map(user => user._id);
        User
          .find({ '_id': { $in: users } })
          .then(users => res.send(users))
          .catch(next);
      })
      .catch(next);
  })
  .get('/leader', (req, res, next) => {
    Comment
      .aggregate([{
        '$group': { _id: '$commentBy', count: { '$sum': 1 } }
      }, {
        '$sort': { count: -1 }
      }, {
        '$limit': 10
      }])
      .then(users => {
        console.log(users);
        users = users.map(user => user._id);
        User
          .find({ '_id': { $in: users } })
          .then(users => res.send(users))
          .catch(next);
      })
      .catch(next);
  });


