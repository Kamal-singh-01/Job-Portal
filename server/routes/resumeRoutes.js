import express from "express";
import upload from "../config/multer.js";

import {
  parseResume,
  analyzeJobMatch
} from "../controllers/resumeController.js";

const router = express.Router();

router.post(
  "/parse",
  upload.single("resume"),
  parseResume
);

router.post(
  "/job-match",
  analyzeJobMatch
);

export default router;