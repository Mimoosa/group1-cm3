require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
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

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  
  // Serve static files
  app.use(express.static(frontendBuildPath));
  
  // Serve index.html for any route not starting with /api
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
    } else {
      res.status(404).json({ message: "API endpoint not found" });
    }
  });
  
  logger.info(`Serving frontend from ${frontendBuildPath}`);
}

// Error handling
app.use(errorLogger);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
