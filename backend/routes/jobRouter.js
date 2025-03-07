const express = require("express");
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobControllers");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Public routes (no auth required)
router.get("/", getJobs);
router.get("/:id", getJob);

// Protected routes (auth required)
router.post("/", requireAuth, createJob);
router.put("/:id", requireAuth, updateJob);
router.delete("/:id", requireAuth, deleteJob);

module.exports = router;
