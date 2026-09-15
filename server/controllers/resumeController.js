import fs from "fs";
import { PDFParse } from "pdf-parse";
import {parseResumeWithGemini,analyzeJobMatchWithGemini} from "../services/geminiService.js";

export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    console.log("Resume received:", req.file.originalname);

    // Read uploaded PDF
    const pdfBuffer = fs.readFileSync(req.file.path);

    // Parse PDF
    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const result = await parser.getText();

    const resumeText = result.text;

    await parser.destroy();

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    console.log("Resume text extracted successfully");

    // Send extracted text to Gemini
    const parsedResume = await parseResumeWithGemini(resumeText);

    // Delete temporary uploaded file
    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      message: "Resume parsed successfully",
      resume: parsedResume,
    });

  } catch (error) {
    console.error("Resume parser error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const analyzeJobMatch = async (req, res) => {
  try {
    const { parsedResume, jobDescription } = req.body;

    if (!parsedResume) {
      return res.status(400).json({
        success: false,
        message: "Parsed resume is required",
      });
    }

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    console.log("Starting job match analysis...");

    const analysis = await analyzeJobMatchWithGemini(
      parsedResume,
      jobDescription
    );

    return res.json({
      success: true,
      message: "Job match analysis completed",
      analysis,
    });

  } catch (error) {
    console.error("Job match analysis error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};