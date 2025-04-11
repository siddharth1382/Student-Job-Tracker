import asyncHandler from 'express-async-handler';
import Job from '../models/Job.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
export const createJob = asyncHandler(async (req, res) => {
  const { position, company, jobLocation, status, jobType, dateOfApplication, link } = req.body;

  if (!position || !company) {
    res.status(400);
    throw new Error('Please provide position and company');
  }

  const job = await Job.create({
    position,
    company,
    jobLocation,
    status,
    jobType,
    dateOfApplication,
    link,
    createdBy: req.user._id,
  });

  res.status(201).json(job);
});

// @desc    Get all jobs for logged-in user
// @route   GET /api/jobs
// @access  Private
export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort('-createdAt');
  res.status(200).json(jobs);
});

// @desc    Delete a job by ID
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  await job.deleteOne();
  res.status(200).json({ message: 'Job deleted successfully' });
});

// @desc    Update a job by ID
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = asyncHandler(async (req, res) => {
  const { position, company, jobLocation, status, jobType, dateOfApplication, link } = req.body;

  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  job.position = position || job.position;
  job.company = company || job.company;
  job.jobLocation = jobLocation || job.jobLocation;
  job.status = status || job.status;
  job.jobType = jobType || job.jobType;
  job.dateOfApplication = dateOfApplication || job.dateOfApplication;
  job.link = link || job.link;

  const updatedJob = await job.save();
  res.status(200).json(updatedJob);
});
