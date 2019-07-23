const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');
const chance = require('chance').Chance();

module.exports = async({ users = 5, posts = 10, comments = 20 } = { users: 5, posts: 10, comments: 20 }) => {
  const createdUsers = await User.create(
    [...Array(users)].map(() => ({
      username: chance.name(),
      profilePhotoUrl: chance.url({ extensions: ['jpg'] }),
      password: 'password'
    }))
  );

  const createdPosts = await Post.create(
    [...Array(posts)].map(() => ({
      user: chance.pickone(createdUsers)._id,
      photoUrl: chance.url({ extensions: ['jpg'] }),
      caption: chance.sentence(),
      tags: chance.sentence().split(' ')
    }))
  );

  const notMatchPost = await Post.create({
    user: createdUsers[1]._id,
    photoUrl: chance.url({ extensions: ['jpg'] }),
    caption: chance.sentence(),
    tags: chance.sentence().split(' ')
  });

  const matchPost = await Post.create({
    user: createdUsers[0]._id,
    photoUrl: chance.url({ extensions: ['jpg'] }),
    caption: chance.sentence(),
    tags: chance.sentence().split(' ')
  });

  createdPosts.unshift(notMatchPost);
  createdPosts.unshift(matchPost);

  const createdComments = await Comment.create(
    [...Array(comments)].map(() => ({
      commentBy: chance.pickone(createdUsers)._id,
      post: chance.pickone(createdPosts)._id,
      comment: chance.sentence()
    }))
  );

  const matchComment = await Comment.create({
    commentBy: createdUsers[0]._id,
    post: createdPosts[0]._id,
    comment: chance.sentence()
  });

  const notMatchComment = await Comment.create({
    commentBy: createdUsers[1]._id,
    post: createdPosts[0]._id,
    comment: chance.sentence()
  });

  createdComments.unshift(notMatchComment);
  createdComments.unshift(matchComment);

  return {
    users: createdUsers,
    posts: createdPosts,
    comments: createdComments
  };
};
