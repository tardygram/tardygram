const { getAgent } = require('../data-helpers');

describe('users routes', () => {
  it('returns a list of top 10 users in terms of comments on their posts', () => {
    return getAgent()
      .get('/api/v1/users/popular')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body).toHaveLength(10);
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          username: expect.any(String),
          total_comments: expect.any(Number),
          profilePhotoUrl: expect.any(String)
        });
      });
  });
  it('responds with 10 users with the most posts', () => {
    return getAgent()
      .get('/api/v1/users/prolific')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          username: expect.any(String),
          profilePhotoUrl: expect.any(String),
          postCount: expect.any(Number),
          __v: 0
        });
      });
  });
  it('responds with 10 users with the most comments', () => {
    return getAgent()
      .get('/api/v1/users/leader')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          username: expect.any(String),
          commentCount: expect.any(Number),
          profilePhotoUrl: expect.any(String)
        });
      });
  });
  it('responds with 10 users with the highest average comments per post', () => {
    return getAgent()
      .get('/api/v1/users/impact')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          avgComments: expect.any(Number),
          username: expect.any(String),
          profilePic: expect.any(String)
        });
      });
  });
});
