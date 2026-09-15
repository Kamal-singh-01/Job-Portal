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

