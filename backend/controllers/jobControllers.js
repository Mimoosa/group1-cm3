const Job = require("../models/jobModel");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

// get all jobs
const getJobs = async (req, res) => {
  try {
    logger.info("Fetching all jobs");
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    logger.info(`Successfully retrieved ${jobs.length} jobs`);
    res.status(200).json(jobs);
  } catch (error) {
    logger.error("Failed to retrieve jobs", { error: error.message });
    res.status(500).json({ message: "Failed to retrieve jobs" });
  }
};

// create new job
const createJob = async (req, res) => {
  try {
    logger.info("Creating new job", { title: req.body.title });
    const newJob = await Job.create({ ...req.body });
    logger.info("Job created successfully", { jobId: newJob._id });
    res.status(201).json(newJob);
  } catch (error) {
    logger.error("Failed to create job", { error: error.message });
    res.status(400).json({ message: "Failed to create job", error: error.message });
  }
};

// get a single job
const getJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn("Invalid job ID format", { jobId: id });
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    logger.info("Fetching job details", { jobId: id });
    const job = await Job.findById(id);
    if (job) {
      logger.info("Job found successfully", { jobId: id });
      res.status(200).json(job);
    } else {
      logger.warn("Job not found", { jobId: id });
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    logger.error("Failed to retrieve job", { jobId: id, error: error.message });
    res.status(500).json({ message: "Failed to retrieve job" });
  }
};

// update a job
const updateJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn("Invalid job ID format", { jobId: id });
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    logger.info("Updating job", { jobId: id });
    const updatedJob = await Job.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (updatedJob) {
      logger.info("Job updated successfully", { jobId: id });
      res.status(200).json(updatedJob);
    } else {
      logger.warn("Job not found for update", { jobId: id });
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    logger.error("Failed to update job", { jobId: id, error: error.message });
    res.status(500).json({ message: "Failed to update job" });
  }
};

// delete a job
const deleteJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn("Invalid job ID format", { jobId: id });
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    logger.info("Attempting to delete job", { jobId: id });
    const deletedJob = await Job.findOneAndDelete({ _id: id });
    if (deletedJob) {
      logger.info("Job deleted successfully", { jobId: id });
      res.status(204).send(); // 204 No Content
    } else {
      logger.warn("Job not found for deletion", { jobId: id });
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    logger.error("Failed to delete job", { jobId: id, error: error.message });
    res.status(500).json({ message: "Failed to delete job" });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};