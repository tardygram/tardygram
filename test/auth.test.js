require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('users routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
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
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test@test.com',
          profilePhotoUrl: 'http://test.jpeg',
          __v: 0
        });
      });
  });
});
