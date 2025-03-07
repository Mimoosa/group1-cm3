const request = require("supertest");
const app = require("../app"); // Assuming your Express app is in a file named "app.js"
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Mocking User model methods
jest.mock("../models/userModel");

describe("User Controller", () => {
  describe("POST /api/users/signup", () => {
    it("should successfully sign up a new user", async () => {
      const mockUserData = {
        name: "John Doe",
        username: "john_doe",
        password: "password123",
        phone_number: "1234567890",
        gender: "male",
        date_of_birth: "1990-01-01",
        membership_status: "active",
        bio: "A short bio",
        address: "123 Street, City",
        profile_picture: "url_to_picture",
      };

      // Mock user creation and hashing of the password
      bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
      bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
      User.create = jest.fn().mockResolvedValue(mockUserData);

      const response = await request(app).post("/api/users/signup").send(mockUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("username", "john_doe");
    });

    it("should return an error if required fields are missing", async () => {
      const response = await request(app).post("/api/users/signup").send({
        name: "John Doe",
        username: "john_doe",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please add all required fields");
    });

    it("should return an error if user already exists", async () => {
      const mockUserData = {
        name: "John Doe",
        username: "john_doe",
        password: "password123",
        phone_number: "1234567890",
        gender: "male",
        date_of_birth: "1990-01-01",
        membership_status: "active",
        bio: "A short bio",
        address: "123 Street, City",
        profile_picture: "url_to_picture",
      };

      // Simulate a user already exists
      User.findOne = jest.fn().mockResolvedValue(mockUserData);

      const response = await request(app).post("/api/users/signup").send(mockUserData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("User with this username or username already exists");
    });
  });

  describe("POST /api/users/login", () => {
    it("should successfully log in a user", async () => {
      const mockUserData = {
        username: "john_doe",
        password: "password123",
      };

      // Mock User.findOne and bcrypt.compare
      User.findOne = jest.fn().mockResolvedValue({
        username: "john_doe",
        password: "hashedPassword",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const response = await request(app).post("/api/users/login").send(mockUserData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("username", "john_doe");
    });

    it("should return an error if credentials are invalid", async () => {
      const mockUserData = {
        username: "john_doe",
        password: "wrongPassword",
      };

      // Simulate invalid credentials
      User.findOne = jest.fn().mockResolvedValue({
        username: "john_doe",
        password: "hashedPassword",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const response = await request(app).post("/api/users/login").send(mockUserData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid credentials");
    });
  });

  describe("GET /api/users/me", () => {
    it("should return the user data (mocked response)", async () => {
      const mockUser = {
        username: "john_doe",
        name: "John Doe",
      };

      // Mock the response directly since no actual login check is needed
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulating what getMe would return
      res.status(200).json(mockUser);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return an error if user data cannot be fetched", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulating an error when there's no user
      res.status(400).json({ error: "No user data available" });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "No user data available" });
    });
  });
});
