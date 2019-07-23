require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');

describe('users routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  let token;
  let post;
  beforeEach(async() => {
    user = await User.create({
      username: 'signin@test.com',
      password: 'password',
      profilePhotoUrl: 'http://test.jpeg'
    });
    token = user.authToken();
    post = await Post.create({
      photoUrl: 'http://generic_photo.jpg',
      user: user._id,
      caption: 'Awesome pic!! Yay',
      tags: ['cats', 'kittens']
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a new post', () => {
    return request(app)
      .post('/api/v1/posts')
      .set('Cookie', [`session=${token}`])
      .send({
        photoUrl: 'http://photo.jpg',
        user: user._id,
        caption: 'Awesome pic!!',
        tags: ['dogs', 'puppies']
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          photoUrl: 'http://photo.jpg',
          user: user._id.toString(),
          caption: 'Awesome pic!!',
          tags: ['dogs', 'puppies'],
          __v: 0
        });
      });
  });

  it('returns a list of all posts', () => {
    return request(app)
      .get('/api/v1/posts')
      .set('Cookie', [`session=${token}`])
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
});
