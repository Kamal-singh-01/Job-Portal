
import Company from "../models/company.js"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../utils/generateToken.js"
import Job from '../models/job.js'
import JobApplication from "../models/jobApplication.js"

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !password || !email || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.json({ success: false, message: "Company already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    // ✅ Await here
    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getComapnyData = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).select('-password');
    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }
    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const postJob = async (req, res) => {
  const { title, location, description, salary, level, category } = req.body;
  const companyId = req.company._id;

  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
    });

    await newJob.save();

    // Send success message along with job
    res.status(200).json({
      success: true,
      message: "Job added successfully",
      newJob,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getComapnyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;  
    console.log("companyId",companyId);

    const applications = await JobApplication.find({ companyId })
      .populate('userId', 'name image resume')   
      .populate('jobId', 'title location salary category level')
      .exec();

    return res.json({ success: true, applications });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const getCompanyPostJobs = async(req, res) => {
  try {
    const companyId = req.company._id
    const jobs = await Job.find({companyId})
    
  // {Adding no of applicant here}

const jobsData = await Promise.all(jobs.map(async (job) => {
  const applicants = await JobApplication.find({jobId: job._id});
  return{...job.toObject(), applicants: applicants.length}
 

}))
  res.json({success: true, jobsData})

  } catch (error) {
      res.json({success: false, message: error.message})

  }

}

export const changeJobApplicationsStatus = async(req, res) => {

try {
  const {id, status} = req.body;
  await JobApplication.findOneAndUpdate({_id: id}, {status})
  
  res.json({success: true, message: "status changed"});
} catch (error) {
    res.json({success: false, message: error.message});

}

}

export const jobVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Job id required" });

    const companyId = req.company && req.company._id;
    if (!companyId) return res.status(401).json({ success: false, message: "Not authenticated" });

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // ensure company owns the job
    if (job.companyId.toString() !== companyId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this job" });
    }

    // toggle explicitly as boolean
    job.visible = !Boolean(job.visible);

    // WAIT for save to finish
    await job.save();

    // return the updated job
    return res.json({ success: true, job });
  } catch (error) {
    console.error("jobVisibility error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
