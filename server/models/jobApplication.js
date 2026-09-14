
import mongoose from "mongoose";

const schema = mongoose.Schema;

const JobApplicationSchema = new schema({

  userId: {
    type: String,
    ref: "User",
    required: true
  },

  companyId: {
    type: schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  jobId: {
    type: schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  // Resume used for this particular application
  resume: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "pending"
  },

  date: {
    type: Number,
    required: true
  },

});

const JobApplication = mongoose.model(
  "JobApplication",
  JobApplicationSchema
);

export default JobApplication;

