const { getAgent, getPosts, getUsers, getComments } = require('../data-helpers');

describe('comments routes', () => {
  it('creates a new comment', () => {
    const users = getUsers();
    const posts = getPosts();

    return getAgent()
      .post('/api/v1/comments')
      .send({
        commentBy: users[0]._id,
        post: posts[0]._id,
        comment: 'Random comment'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          commentBy: users[0]._id.toString(),
          post: posts[0]._id.toString(),
          comment: 'Random comment',
          __v: 0
        });
      });
  });

  it('deletes a comment with DELETE', () => {
    const user = getUsers()[0];
    const comment = getComments()[0];
    const post = getPosts()[0];

    return getAgent()
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: comment._id.toString(),
          commentBy: user._id.toString(),
          post: post._id,
          comment: comment.comment,
          __v: 0
        });
      });
  });

  it('does not delete a comment with DELETE, with incorrect user', () => {
    const comment = getComments()[1];

    return getAgent()
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'User does not match comment user',
          status: 401
        });
      });
  });
});
