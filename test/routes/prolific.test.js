const { getAgent } = require('../data-helpers');

describe('users routes', () => {
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
          profilePhotoUrl: expect.any(String),
          __v: 0
        });
      });
  });
});

