const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

// Create a supertest agent for testing HTTP requests
const api = supertest(app);

// Set Jest timeout to 30 seconds for all tests
jest.setTimeout(30000);

/**
 * Test data for users
 */
const testUsers = [
  {
    name: "Regular Test User",
    username: "regularuser",
    password: "password123",
    phone_number: "123-456-7890",
    gender: "Female",
    date_of_birth: new Date("1995-05-15"),
    membership_status: "Active",
    bio: "Regular test user bio",
    address: "123 Test Street"
  },
  {
    name: "Admin Test User",
    username: "adminuser",
    password: "adminpass456",
    phone_number: "987-654-3210",
    gender: "Male",
    date_of_birth: new Date("1990-10-20"),
    membership_status: "Premium",
    bio: "Admin test user bio",
    address: "456 Admin Avenue"
  }
];

/**
 * Connect to MongoDB before all tests
 */
beforeAll(async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Drop the collection to remove any existing indexes
    await mongoose.connection.collection('users').drop().catch(err => {
      // Ignore collection does not exist error
      if (err.code !== 26) throw err;
    });
    
    // Clear the user collection
    await User.deleteMany({});
    
    // Create initial test users with hashed passwords
    const salt = await bcrypt.genSalt(10);
    const hashedUsers = await Promise.all(testUsers.map(async user => {
      return {
        ...user,
        password: await bcrypt.hash(user.password, salt)
      };
    }));
    
    await User.insertMany(hashedUsers);
  } catch (error) {
    console.error('Error in test setup:', error);
    process.exit(1);
  }
}, 30000); // 30 seconds timeout

/**
 * Clean up after tests
 */
afterAll(async () => {
  await mongoose.connection.close();
}, 30000); // 30 seconds timeout

/**
 * Tests for POST /api/users/signup endpoint
 */
describe('POST /api/users/signup', () => {
  test('a new user can be created with valid data', async () => {
    const newUser = {
      name: "New Test User",
      username: "newuser",
      password: "newpass123",
      phone_number: "555-123-4567",
      gender: "Non-binary",
      date_of_birth: "2000-01-01",
      membership_status: "Free",
      bio: "New user test bio",
      address: "789 New Street"
    };
    
    const response = await api
      .post('/api/users/signup')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    // Check that response contains token and username
    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe(newUser.username);
    
    // Check that user was added to database
    const allUsers = await User.find({});
    expect(allUsers).toHaveLength(testUsers.length + 1);
    
    const usernames = allUsers.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });
  
  test('signup fails if username already exists', async () => {
    const duplicateUser = {
      name: "Duplicate User",
      username: "regularuser", // Already exists in testUsers
      password: "duplicatepass",
      phone_number: "111-222-3333",
      gender: "Male",
      date_of_birth: "1997-07-07",
      membership_status: "Active",
      bio: "Duplicate user bio",
      address: "777 Duplicate Lane"
    };
    
    await api
      .post('/api/users/signup')
      .send(duplicateUser)
      .expect(400);
    
    // Verify user count hasn't changed
    const allUsers = await User.find({});
    expect(allUsers).toHaveLength(testUsers.length + 1);
  });
  
  test('signup fails if required fields are missing', async () => {
    const incompleteUser = {
      name: "Incomplete User",
      username: "incompleteuser"
      // Missing required fields
    };
    
    await api
      .post('/api/users/signup')
      .send(incompleteUser)
      .expect(400);
    
    // Verify user count hasn't changed
    const allUsers = await User.find({});
    expect(allUsers).toHaveLength(testUsers.length + 1);
  });
});

/**
 * Tests for POST /api/users/login endpoint
 */
describe('POST /api/users/login', () => {
  test('login succeeds with correct credentials', async () => {
    const loginUser = {
      username: "regularuser",
      password: "password123"
    };
    
    const response = await api
      .post('/api/users/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    // Check that response contains token and username
    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe(loginUser.username);
  });
  
  test('login fails with incorrect password', async () => {
    const loginUser = {
      username: "regularuser",
      password: "wrongpassword"
    };
    
    await api
      .post('/api/users/login')
      .send(loginUser)
      .expect(400);
  });
  
  test('login fails with non-existent username', async () => {
    const loginUser = {
      username: "nonexistentuser",
      password: "password123"
    };
    
    await api
      .post('/api/users/login')
      .send(loginUser)
      .expect(400);
  });
});

/**
 * Tests for token generation and validation
 */
describe('Token Generation and Validation', () => {
  test('signup generates a valid JWT token', async () => {
    const newUser = {
      name: "Token Test User",
      username: "tokenuser",
      password: "tokenpass123",
      phone_number: "555-123-4567",
      gender: "Non-binary",
      date_of_birth: "2000-01-01",
      membership_status: "Free",
      bio: "Token test bio",
      address: "123 Token Street"
    };
    
    const response = await api
      .post('/api/users/signup')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    // Verify token exists
    expect(response.body.token).toBeDefined();
    
    // Verify token can be decoded with our secret
    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
    
    // Verify token contains expected data
    expect(decodedToken).toHaveProperty('_id');
    expect(decodedToken).toHaveProperty('exp');
    expect(decodedToken).toHaveProperty('iat');
    
    // Verify token expiration is set to 3 days from now (with 5 second tolerance)
    const expectedExp = Math.floor(Date.now() / 1000) + (3 * 24 * 60 * 60);
    expect(decodedToken.exp).toBeGreaterThan(expectedExp - 5);
    expect(decodedToken.exp).toBeLessThan(expectedExp + 5);
  });

  test('login generates a valid JWT token', async () => {
    // First create a user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('testpass123', salt);
    
    const user = await User.create({
      name: "Login Token User",
      username: "logintokenuser",
      password: hashedPassword,
      phone_number: "555-999-8888",
      gender: "Female",
      date_of_birth: new Date("1995-05-15"),
      membership_status: "Active",
      bio: "Login token test bio",
      address: "456 Token Avenue"
    });

    // Then try to login
    const response = await api
      .post('/api/users/login')
      .send({
        username: "logintokenuser",
        password: "testpass123"
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Verify token exists
    expect(response.body.token).toBeDefined();
    
    // Verify token can be decoded with our secret
    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
    
    // Verify token contains expected data
    expect(decodedToken).toHaveProperty('_id');
    expect(decodedToken._id).toBe(user._id.toString());
    expect(decodedToken).toHaveProperty('exp');
    expect(decodedToken).toHaveProperty('iat');
    
    // Verify token expiration is set to 3 days from now (with 5 second tolerance)
    const expectedExp = Math.floor(Date.now() / 1000) + (3 * 24 * 60 * 60);
    expect(decodedToken.exp).toBeGreaterThan(expectedExp - 5);
    expect(decodedToken.exp).toBeLessThan(expectedExp + 5);
  });

  test('invalid token returns 401 unauthorized', async () => {
    await api
      .post('/api/jobs')  // Using POST /api/jobs since it requires auth
      .set('Authorization', 'Bearer invalidtoken123')
      .expect(401);
  });
});