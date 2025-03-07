const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Job = require('../models/jobModel');
const request = require('supertest');
const app = require('../app');

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Close any existing connection and connect to the in-memory DB
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  // Clear database after each test
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  // Disconnect from MongoDB and stop in-memory server
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Job Controller Tests', () => {
  it('should create a new job', async () => {
    const newJob = {
      title: 'Software Engineer',
      type: 'Full-time',
      description: 'Develop software applications',
      location: 'Remote',
      salary: 90000,
      company: {
        name: 'Tech Corp',          // Make sure the company name is provided
        contactEmail: 'hr@techcorp.com', // Add contact email
        contactPhone: '1234567890', // Add contact phone
      },
    };

    const response = await request(app).post('/api/jobs').send(newJob);

    expect(response.status).toBe(201); // 201 Created
    expect(response.body.title).toBe(newJob.title);
  });

  it('should fetch all jobs', async () => {
    const response = await request(app).get('/api/jobs');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch job by ID', async () => {
    const newJob = {
      title: 'Software Engineer',
      type: 'Full-time',
      description: 'Develop software applications',
      location: 'Remote',
      salary: 90000,
      company: {
        name: 'Tech Corp',
        contactEmail: 'hr@techcorp.com',
        contactPhone: '1234567890',
      },
    };

    const createdJob = await Job.create(newJob);

    const response = await request(app).get(`/api/jobs/${createdJob._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(createdJob.title);
  });

  it('should update job by ID', async () => {
    const newJob = {
      title: 'Software Engineer',
      type: 'Full-time',
      description: 'Develop software applications',
      location: 'Remote',
      salary: 90000,
      company: {
        name: 'Tech Corp',
        contactEmail: 'hr@techcorp.com',
        contactPhone: '1234567890',
      },
    };

    const createdJob = await Job.create(newJob);

    const updatedJob = {
      ...newJob,
      title: 'Senior Software Engineer',
    };

    const response = await request(app)
      .put(`/api/jobs/${createdJob._id}`)
      .send(updatedJob);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedJob.title);
  });

  it('should delete job by ID', async () => {
    const newJob = {
      title: 'Software Engineer',
      type: 'Full-time',
      description: 'Develop software applications',
      location: 'Remote',
      salary: 90000,
      company: {
        name: 'Tech Corp',
        contactEmail: 'hr@techcorp.com',
        contactPhone: '1234567890',
      },
    };

    const createdJob = await Job.create(newJob);

    const response = await request(app).delete(`/api/jobs/${createdJob._id}`);
    expect(response.status).toBe(204); // 204 No Content
  });
});
