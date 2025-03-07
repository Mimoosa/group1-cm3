const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

// Create a supertest agent for testing HTTP requests
const api = supertest(app);

// Set Jest timeout to 30 seconds for all tests
jest.setTimeout(30000);

/**
 * Connect to MongoDB before all tests
 */
beforeAll(async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }

  // Clear the job and user collections
  await Job.deleteMany({});
  await User.deleteMany({});
  
  // Create test user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testUser.password, salt);
  
  const user = await User.create({
    ...testUser,
    password: hashedPassword
  });
  
  // Generate token for the test user
  token = jwt.sign({ _id: user._id }, process.env.SECRET, {
    expiresIn: "3d",
  });
  
  // Create initial test jobs
  await Job.insertMany(testJobs);
});

/**
 * Clean up after tests
 */
afterAll(async () => {
  await mongoose.connection.close();
});

/**
 * Test data for jobs
 */
const testJobs = [
  {
    title: "Test Software Engineer",
    type: "Full-time",
    description: "This is a test job for software engineers",
    company: {
      name: "Test Tech Inc.",
      contactEmail: "test@tech.com",
      contactPhone: "123-456-7890",
      website: "https://www.testtech.com",
      size: 100,
    },
    location: "Test City",
    salary: 80000,
    experienceLevel: "Mid",
    status: "open",
    requirements: ["JavaScript", "Node.js"],
  },
  {
    title: "Test Designer",
    type: "Part-time",
    description: "This is a test job for designers",
    company: {
      name: "Design Co.",
      contactEmail: "test@design.com",
      contactPhone: "987-654-3210",
      website: "https://www.designco.com",
      size: 50,
    },
    location: "Design City",
    salary: 60000,
    experienceLevel: "Entry",
    status: "open",
    requirements: ["Figma", "Sketch"],
  }
];

// Test user for authentication tests
let token = null;
const testUser = {
  name: "Test User",
  username: "testuser",
  password: "password123",
  phone_number: "123-456-7890",
  gender: "Male",
  date_of_birth: new Date("1990-01-01"),
  membership_status: "Active",
  bio: "Test bio",
  address: "Test Address"
};

/**
 * Tests for GET /api/jobs endpoint
 */
describe('GET /api/jobs', () => {
  test('jobs are returned as json', async () => {
    await api
      .get('/api/jobs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all jobs are returned', async () => {
    const response = await api.get('/api/jobs');
    expect(response.body).toHaveLength(testJobs.length);
  });

  test('jobs contain expected content', async () => {
    const response = await api.get('/api/jobs');
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    expect(response.body[0].company).toBeDefined();
  });
});

/**
 * Tests for GET /api/jobs/:jobId endpoint
 */
describe('GET /api/jobs/:jobId', () => {
  test('a specific job can be retrieved', async () => {
    // First get all jobs to find a valid ID
    const allJobs = await api.get('/api/jobs');
    const jobId = allJobs.body[0]._id;
    
    // Then get the specific job
    const response = await api
      .get(`/api/jobs/${jobId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    expect(response.body.title).toBe(testJobs[0].title);
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = 'invalidid';
    
    await api
      .get(`/api/jobs/${invalidId}`)
      .expect(400);
  });

  test('fails with statuscode 404 if job does not exist', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    
    await api
      .get(`/api/jobs/${nonExistingId}`)
      .expect(404);
  });
});

/**
 * Tests for POST /api/jobs endpoint
 */
describe('POST /api/jobs', () => {
  test('a valid job can be added with authentication', async () => {
    const newJob = {
      title: "New Test Job",
      type: "Contract",
      description: "This is a new test job",
      company: {
        name: "New Company",
        contactEmail: "new@company.com",
        contactPhone: "111-222-3333",
        website: "https://www.newcompany.com",
        size: 200,
      },
      location: "New City",
      salary: 90000,
      experienceLevel: "Senior",
      status: "open",
      requirements: ["Python", "Django"],
    };
    
    // Post with authentication
    await api
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(newJob)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    // Verify the job was added
    const allJobs = await api.get('/api/jobs');
    expect(allJobs.body).toHaveLength(testJobs.length + 1);
    
    const titles = allJobs.body.map(job => job.title);
    expect(titles).toContain('New Test Job');
  });

  test('adding a job fails with proper statuscode if no token provided', async () => {
    const newJob = {
      title: "Job Without Auth",
      type: "Contract",
      description: "This should fail",
      company: {
        name: "Auth Company",
        contactEmail: "auth@company.com",
        contactPhone: "111-222-3333",
        website: "https://www.authcompany.com",
        size: 200,
      },
      location: "Auth City",
      salary: 90000,
      experienceLevel: "Senior",
      status: "open",
      requirements: ["Auth", "Security"],
    };
    
    await api
      .post('/api/jobs')
      .send(newJob)
      .expect(401);
    
    // Verify job count hasn't changed
    const allJobs = await api.get('/api/jobs');
    expect(allJobs.body).toHaveLength(testJobs.length + 1);
  });

  test('adding a job fails with proper statuscode if data is invalid', async () => {
    // Job missing required fields
    const invalidJob = {
      title: "Invalid Job",
      // missing type and other required fields
    };
    
    await api
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidJob)
      .expect(400);
  });
});

/**
 * Tests for PUT /api/jobs/:jobId endpoint
 */
describe('PUT /api/jobs/:jobId', () => {
  test('a job can be updated with authentication', async () => {
    // First get all jobs to find a valid ID
    const allJobs = await api.get('/api/jobs');
    const jobToUpdate = allJobs.body[0];
    const jobId = jobToUpdate._id;
    
    // Update job data
    const updatedData = {
      ...jobToUpdate,
      title: "Updated Job Title",
      salary: 95000
    };
    
    await api
      .put(`/api/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    // Verify the job was updated
    const response = await api.get(`/api/jobs/${jobId}`);
    expect(response.body.title).toBe("Updated Job Title");
    expect(response.body.salary).toBe(95000);
  });

  test('updating a job fails if no token provided', async () => {
    const allJobs = await api.get('/api/jobs');
    const jobToUpdate = allJobs.body[0];
    const jobId = jobToUpdate._id;
    
    await api
      .put(`/api/jobs/${jobId}`)
      .send({...jobToUpdate, title: "Unauthorized Update"})
      .expect(401);
  });
});

/**
 * Tests for DELETE /api/jobs/:jobId endpoint
 */
describe('DELETE /api/jobs/:jobId', () => {
  test('a job can be deleted with authentication', async () => {
    // First get all jobs to find a valid ID
    const allJobs = await api.get('/api/jobs');
    const initialCount = allJobs.body.length;
    const jobId = allJobs.body[0]._id;
    
    await api
      .delete(`/api/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    
    // Verify the job was deleted
    const jobsAfterDelete = await api.get('/api/jobs');
    expect(jobsAfterDelete.body).toHaveLength(initialCount - 1);
    
    // Check the specific job is gone
    await api
      .get(`/api/jobs/${jobId}`)
      .expect(404);
  });

  test('deleting a job fails if no token provided', async () => {
    const allJobs = await api.get('/api/jobs');
    const jobId = allJobs.body[0]._id;
    
    await api
      .delete(`/api/jobs/${jobId}`)
      .expect(401);
  });
});