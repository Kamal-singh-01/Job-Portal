import express from "express";
import upload from "../config/multer.js";
import { parseResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post(
  "/parse",
  upload.single("resume"),
  parseResume
);

export default router;