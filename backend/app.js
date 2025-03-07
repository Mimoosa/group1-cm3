require('dotenv').config()
const express = require("express");
const app = express();
const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");
const logRouter = require("./routes/logRouter");
const { requestLogger, errorLogger, unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
const logger = require("./utils/logger");

// Middlewares
app.use(cors())
app.use(express.json());

// Request logging middleware
app.use(requestLogger);

connectDB();

// Routes
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);
app.use("/api/logs", logRouter);

// Error handling
app.use(errorLogger);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
