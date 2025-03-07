const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../utils/logger");

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    logger.warn("Authorization token missing");
    return res.status(401).json({ error: "Authorization token required" });
  }

  // Check if authorization header starts with 'Bearer '
  if (!authorization.startsWith('Bearer ')) {
    logger.warn("Invalid token format", { authorization });
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const token = authorization.split(" ")[1];
    logger.debug("Verifying JWT token");
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id }).select("_id");
    logger.info("User authenticated successfully", { userId: _id });
    next();
  } catch (error) {
    logger.error("Authentication failed", { error: error.message });
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
