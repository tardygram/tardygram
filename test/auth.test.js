require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('users routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({
      username: 'signin@test.com',
      password: 'password',
      profilePhotoUrl: 'http://test.jpeg'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates and returns new user', () => {
    return request(app)
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
    return request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: user.username,
        password: 'password'
      })
      .then(res => {
        expect(res.header['set-cookie']).toBeTruthy();
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'signin@test.com',
          profilePhotoUrl: 'http://test.jpeg',
          __v: 0
        });
      });
  });
});
