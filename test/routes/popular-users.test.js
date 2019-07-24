const { getAgent } = require('../data-helpers');

describe('popular user aggregation', () => {
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
});
