const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});

commentSchema.statics.getUsersByAvgComments = function() {
  return this.aggregate([
    {
      '$group': {
        '_id': '$post', 
        'commentCount': {
          '$sum': 1
        }
      }
    }, {
      '$lookup': {
        'from': 'posts', 
        'localField': '_id', 
        'foreignField': '_id', 
        'as': 'post'
      }
    }, {
      '$unwind': {
        'path': '$post', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': '$post.user', 
        'totalComments': {
          '$sum': '$commentCount'
        }, 
        'totalPosts': {
          '$sum': 1
        }
      }
    }, {
      '$project': {
        'avgComments': {
          '$divide': [
            '$totalComments', '$totalPosts'
          ]
        }
      }
    }, {
      '$sort': {
        'avgComments': -1
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
        'avgComments': true, 
        'username': '$user.username', 
        'profilePic': '$user.profilePhotoUrl'
      }
    }
  ]);
};

module.exports = mongoose.model('Comment', commentSchema);
