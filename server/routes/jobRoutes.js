import express from 'express'
import { getJobById, getJobs } from '../controllers/jobControlller.js';

const router = express.Router();

//route get all the data
router.get('/', getJobs);

//route to get a single job by id
router.get('/:id', getJobById)

export default router;