const { Router } = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

module.exports = Router()
  .get('/popular', (req, res, next) => {
    Post
      .getPopularUsersByComments()
      .then(users => res.send(users))
      .catch(next);
  })
  .get('/prolific', (req, res, next) => {
    Post
      .aggregate([
        {
          '$group': {
            '_id': '$user',
            'count': {
              '$sum': 1
            }
          }
        }, {
          '$sort': {
            'count': -1
          }
        }, {
          '$limit': 10
        }, {
          '$lookup': {
            'from': 'users',
            'localField': '_id',
            'foreignField': '_id',
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            'postCount': '$count',
            'username': '$user.username',
            'profilePhotoUrl': '$user.profilePhotoUrl',
            '__v': '$user.__v'
          }
        }
      ])
      .then(usersWithPostCount => res.send(usersWithPostCount))
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
        users = users.map(user => user._id);
        User
          .find({ '_id': { $in: users } })
          .then(users => res.send(users))
          .catch(next);
      })
      .catch(next);
  })
  .get('/impact', (req, res, next) => {
    Comment
      .getUsersByAvgComments()
      .then(users => res.send(users))
      .catch(next);
  });
