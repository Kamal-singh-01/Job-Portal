import express from 'express';
import Job from '../models/job.js'
import { 
    changeJobApplicationsStatus, 
    getComapnyData, 
    getComapnyJobApplicants,
    getCompanyPostJobs, 
    jobVisibility, 
    loginCompany, 
    postJob, 
    registerCompany,
} from '../controllers/companyController.js';
import { protectCompany } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';  



const router = express.Router();

// Public routes
router.post('/register', upload.single('image'), registerCompany);  // ✅ multer handles image + text
router.post('/login', loginCompany);

// Protected routes
router.get('/company', protectCompany, getComapnyData);
router.post('/post-job', protectCompany, postJob);
router.get('/applicants', protectCompany, getComapnyJobApplicants);
router.get('/list-job', protectCompany, getCompanyPostJobs);
router.post('/change-status', protectCompany, changeJobApplicationsStatus);
router.post('/change-visibility', protectCompany, jobVisibility);


export default router;
