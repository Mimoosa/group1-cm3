const express = require("express");
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobControllers");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Public routes (no auth required)
router.get("/", getAllJobs);
router.get("/:jobId", getJobById);

// Protected routes (auth required)
router.post("/", requireAuth, createJob);
router.put("/:jobId", requireAuth, updateJob);
router.delete("/:jobId", requireAuth, deleteJob);

module.exports = router;
