const { getAgent, getUsers } = require('../data-helpers');

describe('users routes', () => {
  it('creates and returns new user', () => {
    return getAgent()
      .post('/api/v1/auth/signup')
      .send({
        username: 'test@test.com',
        password: 'password',
        profilePhotoUrl: 'http://test.jpeg'
      })
      .then(res => {
        expect(res.header['set-cookie']).toBeTruthy();
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test@test.com',
          profilePhotoUrl: 'http://test.jpeg',
          __v: 0
        });
      });
  });

  it('signs in a user, returns user', () => {
    const user = getUsers()[0];
    return getAgent()
      .post('/api/v1/auth/signin')
      .send({
        username: user.username,
        password: 'password'
      })
      .then(res => {
        expect(res.header['set-cookie']).toBeTruthy();
        expect(res.body).toEqual({
          _id: user._id.toString(),
          username: user.username,
          profilePhotoUrl: user.profilePhotoUrl,
          __v: 0
        });
      });
  });

  it('verifies a user with token, returns user', () => {
    const user = getUsers()[0];
    return getAgent()
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id.toString(),
          username: user.username,
          profilePhotoUrl: user.profilePhotoUrl,
          __v: 0
        });
      });
  });
});
