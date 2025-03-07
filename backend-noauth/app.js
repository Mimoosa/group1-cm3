require('dotenv').config()
const express = require("express");
const app = express();
const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");
const { unknownEndpoint,errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Middlewares
app.use(cors())
app.use(express.json());

connectDB();

// Serve the static files from the React app (frontend) in the dist folder
app.use(express.static('dist'))

// Use the jobRouter for all "/jobs" routes
app.use("/api/jobs", jobRouter);
// Use the userRouter for all "/users" routes
app.use("/api/users", userRouter);

// Path
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
