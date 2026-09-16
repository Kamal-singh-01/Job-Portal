import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_PARSER_KEY,
});

export const parseResumeWithGemini = async (resumeText) => {
  try {
    const prompt = `
You are an expert resume parser.

Analyze the following resume and extract the information into JSON.

Resume:
----------------
${resumeText}
----------------

Return ONLY valid JSON.

Use exactly this structure:

{
  "name": "",
  "email": "",
  "phone": "",
  "summary": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": []
}

Rules:
- Do not invent information.
- If information is not available, use an empty string or empty array.
- skills must contain individual technical or professional skills.
- education should contain degree, institution and year if available.
- experience should contain company, role and duration if available.
- projects should contain project name and description if available.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text;

    // Remove markdown code fences if Gemini adds them
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);
    console.error("==================================");

    throw new Error(error.message || "Gemini API failed");
  }
};

export const analyzeJobMatchWithGemini = async (
  parsedResume,
  jobDescription
) => {
  const prompt = `
You are an expert ATS resume and job matching system.

Compare the candidate's parsed resume with the job description.

IMPORTANT:
- Evaluate only information actually present in the resume.
- Do not invent candidate experience or skills.
- Identify skills that are clearly relevant to the job.
- Missing skills should be skills required or strongly preferred by the job that are not present in the resume.
- Give a realistic match score from 0 to 100.
- Return ONLY valid JSON.
- Do not include markdown or code fences.

CANDIDATE RESUME:
----------------
${JSON.stringify(parsedResume, null, 2)}
----------------

JOB DESCRIPTION:
----------------
${jobDescription}
----------------

Return exactly this JSON structure:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "recommendations": []
}

Rules:

1. matchScore:
   - Integer between 0 and 100.

2. matchedSkills:
   - Skills from the resume that match the job requirements.

3. missingSkills:
   - Important job requirements not found in the resume.
   - Do not mark unrelated skills as missing.

4. strengths:
   - 3 to 5 concise points.

5. recommendations:
   - 3 to 5 practical suggestions.
   - Do not suggest claiming experience the candidate does not have.
`;

  try {
    console.log("Gemini job match: gemini-3.6-flash");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text;

    console.log("Gemini job match response:");
    console.log(text);

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (error) {
    console.error("========== GEMINI JOB MATCH ERROR ==========");
    console.error(error);
    console.error("============================================");

    throw new Error(
      error.message || "Failed to analyze job match using Gemini"
    );
  }
};