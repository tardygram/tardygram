const { getAgent, getPosts, getUsers } = require('../data-helpers');

describe('users routes', () => {
  it('creates a new post', () => {
    const users = getUsers();
    return getAgent()
      .post('/api/v1/posts')
      .send({
        photoUrl: 'http://photo.jpg',
        user: users[0]._id,
        caption: 'Awesome pic!!',
        tags: ['dogs', 'puppies']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          photoUrl: 'http://photo.jpg',
          user: users[0]._id.toString(),
          caption: 'Awesome pic!!',
          tags: ['dogs', 'puppies'],
          __v: 0
        });
      });
  });

  it('returns a post by its id', () => {
    const posts = getPosts();
    return getAgent()
      .get(`/api/v1/posts/${posts[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: posts[0]._id.toString(),
          photoUrl: posts[0].photoUrl,
          user: {
            _id: posts[0].user,
            profilePhotoUrl: expect.any(String),
            username: expect.any(String),
            __v: 0
          },
          caption: posts[0].caption,
          tags: posts[0].tags,
          comments: expect.any(Array),
          __v: 0
        });
        expect(res.body.comments[0]).toEqual({
          _id: expect.any(String),
          commentBy: expect.any(String),
          post: posts[0]._id.toString(),
          comment: expect.any(String),
          __v: 0
        });
      });
  });

  it('returns a list of all posts', () => {
    return getAgent()
      .get('/api/v1/posts')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          photoUrl: expect.any(String),
          user: expect.any(String),
          caption: expect.any(String),
          tags: expect.any(Array),
          __v: 0
        });
      });
  });

  it('updates a post', () => {
    const posts = getPosts();
    return getAgent()
      .patch(`/api/v1/posts/${posts[0]._id}`)
      .send({
        caption: 'Awesome pic!! Again.',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: posts[0]._id.toString(),
          user: posts[0].user.toString(),
          photoUrl: posts[0].photoUrl,
          caption: 'Awesome pic!! Again.',
          tags: posts[0].tags,
          __v: 0
        });
      });
  });

  it('does not update a post when user did not create post', async() => {
    const posts = getPosts();
    return getAgent()
      .patch(`/api/v1/posts/${posts[1]._id}`)
      .send({
        caption: 'Awesome pic!! Again.',
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'You are not logged in as the correct user',
          status: 401
        });
      });
  });

  it('deletes a post with DELETE as the correct user', () => {
    const posts = getPosts();
    return getAgent()
      .delete(`/api/v1/posts/${posts[0]._id}`)
      .then(res => {
        const postJSON = JSON.parse(JSON.stringify(posts[0]));
        expect(res.body).toEqual(postJSON);
      });
  });

  it('attempts to delete a post with DELETE as the incorrect user', () => {
    const posts = getPosts();
    return getAgent()
      .delete(`/api/v1/posts/${posts[1]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'You are not logged in as the correct user',
          status: 401
        });
      });
  });
});
