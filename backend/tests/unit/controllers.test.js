const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');

// Mock data
const mockUserData = {
  username: 'testuser',
  password: 'testpassword',
  email: 'testuser@example.com'
};

// Mock user model
jest.mock('../../models/User');

describe('User Controller Tests', () => {
  beforeEach(() => {
    User.findById.mockClear();
    User.findOne.mockClear();
  });

  test('should create a new user', async () => {
    User.create.mockImplementation(() => Promise.resolve(mockUserData));
    const response = await request(app)
      .post('/api/users')
      .send(mockUserData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  test('should get user by ID', async () => {
    User.findById.mockImplementation(() => Promise.resolve(mockUserData));
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });
});
