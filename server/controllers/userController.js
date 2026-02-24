
import { compare } from "bcrypt";
import JobApplication from "../models/jobApplication.js";
import User from "../models/user.js";
import Job from "../models/job.js";
import { v2 as cloudinary } from "cloudinary";
import { clerkClient } from "@clerk/clerk-sdk-node";

// Get User data
export const getUserData = async (req, res) => {
  try {
    const { userId: clerkId } = req.auth();
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ _id: clerkId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("getUserData error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const syncUserFromClerk = async (req, res) => {
  try {
    console.log("🔄 syncUserFromClerk called");

    // Get token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No valid token provided" });
    }

    const token = authHeader.substring(7); // remove Bearer prefix
    const tokenPayload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const userId = tokenPayload.sub;

    // ✅ Always fetch fresh user data from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);

    let fullName = (clerkUser.firstName || "") + " " + (clerkUser.lastName || "");
    fullName = fullName.trim() || "Anonymous";

    // ✅ Upsert user in MongoDB
    const user = await User.findOneAndUpdate(
      { _id: clerkUser.id }, // use Clerk ID as _id
      {
        email: clerkUser.emailAddresses[0]?.emailAddress || "no-email@example.com",
        name: fullName,
        image: clerkUser.imageUrl || "",
      },
      { upsert: true, new: true }
    );

    console.log("✅ Synced user:", user);
    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ syncUserFromClerk error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// applyForJob.js
export const applyForJob = async (req, res) => {
  try {
    console.log("api call");
    const { userId } = req.auth;
    const { jobId } = req.body;
    console.log("Creating application:", { userId, jobId });


    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!jobId) return res.status(400).json({ success: false, message: "jobId is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // ✅ Ensure both fields are checked
    const existingApplication = await JobApplication.findOne({
      userId: userId.toString(),
      jobId: jobId.toString(),
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "Already applied to this job" });
    }

    await JobApplication.create({
      userId: userId.toString(),
      jobId: jobId.toString(),
      companyId: job.companyId,
      status: "pending",
      date: Date.now(),
    });

    res.status(200).json({ success: true, message: "Job applied successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get user job applications
export const getUserJobApplication = async (req, res) => {
  try {
    const { userId } = req.auth();
    console.log(userId);

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    if (!applications || applications.length === 0) {
      return res.json({
        success: false,
        message: "No job application found for this user",
      });
    }

    res.json({ success: true, applications });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// Update user resume
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId // ✅ get Clerk userId correctly

    
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure file exists
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const resumeUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    // Update user resume
    userData.resume = resumeUpload.secure_url;
    await userData.save();

    return res.json({
      success: true,
      message: "Resume Updated",
      resume: userData.resume,
    });
  } catch (error) {
    console.error("updateUserResume error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

