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

router.get("/", getAllJobs);
router.get("/:jobId", getJobById);
router.post("/", requireAuth, createJob);
router.put("/:jobId", requireAuth, updateJob);
router.delete("/:jobId", requireAuth, deleteJob);

module.exports = router;
