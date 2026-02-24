import express, { application } from "express";
import { requireAuth } from "@clerk/express";
import { 
  getUserData, 
  applyForJob, 
  getUserJobApplication, 
  updateUserResume,
  syncUserFromClerk
} from "../controllers/userController.js";
import upload from "../config/multer.js";

const router = express.Router();

// User routes with authentication
router.get("/user", requireAuth, getUserData);
// Temporarily remove requireAuth from sync route
router.get("/sync", syncUserFromClerk);
router.post("/apply",applyForJob);
router.get("/applications", getUserJobApplication);
// Use multer middleware to handle single file upload with field name 'resume'
// Temporarily disable requireAuth due to Clerk session issues; controller validates token from header
router.post("/resume", upload.single('resume'), updateUserResume);

// Test route without authentication
router.get("/test", (req, res) => {
  console.log('🧪 User route test hit');
  res.json({ 
    message: 'User route test successful',
    timestamp: new Date().toISOString()
  });
});

export default router;
