import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, 'Please provide the job position'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true,
    },
    jobLocation: {
      type: String,
      default: 'Remote',
    },
    status: {
      type: String,
      enum: ['pending', 'interview', 'declined'],
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    dateOfApplication: {
      type: Date,
    },
    link: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
