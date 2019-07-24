const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  caption: String,
  tags: [String]
});

postSchema.statics.getPopularUsersByComments = function() {
  return this.aggregate([
    {
      '$lookup': {
        'from': 'comments',
        'localField': '_id',
        'foreignField': 'post',
        'as': 'comments'
      }
    }, {
      '$project': {
        'user': true,
        'comment_count': {
          '$cond': {
            'if': {
              '$isArray': '$comments'
            },
            'then': {
              '$size': '$comments'
            },
            'else': 'NA'
          }
        }
      }
    }, {
      '$group': {
        '_id': '$user',
        'total_comments': {
          '$sum': '$comment_count'
        }
      }
    }, {
      '$sort': {
        'total_comments': -1
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
        'total_comments': true,
        'username': '$user.username',
        'profilePhotoUrl': '$user.profilePhotoUrl',
      }
    }
  ]);
};

postSchema.statics.getUsersByMostPosts = function() {
  return this.aggregate([
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
  ]);
};

module.exports = mongoose.model('Post', postSchema);
