import { GoogleGenAI } from "@google/genai";
import Job from "../models/job.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.6-flash";


export const chatWithGemini = async (req, res) => {
    try {
        const {
            message,
            history = []
        } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }


      
        //  Give Gemini the conversation
        
        const conversation = history
            .filter(
                (item) =>
                    item.sender === "user" ||
                    item.sender === "bot"
            )
            .map((item) => {
                return `${item.sender === "user" ? "User" : "Assistant"}: ${item.text}`;
            })
            .join("\n");


       
        // Ask Gemini to understand
        // what the user is looking for
       

        const filterPrompt = `
You are a job search assistant.

Analyze the user's request and return ONLY valid JSON.

The JSON must have this exact structure:

{
  "isJobSearch": true,
  "title": "",
  "location": "",
  "category": "",
  "level": "",
  "minSalary": null
}

Rules:

- isJobSearch should be true only if the user is asking about finding/searching jobs.
- title should contain the job title or technology if mentioned.
- location should contain the city/location if mentioned.
- category should contain the job category if mentioned.
- level should contain the experience level if mentioned.
- minSalary should contain the minimum salary number if mentioned.
- If something is not mentioned, use "" or null.
- Do not invent values.
- Return JSON only.

Available categories include:
Programming, Data Science, Designing, Networking, Management, Marketing, Cybersecurity.

Available levels include:
Beginner level, Intermediate level, Senior level.

Conversation:
${conversation}

Current user message:
${message}
`;


        const filterResponse = await ai.models.generateContent({
            model: MODEL,
            contents: filterPrompt
        });


        let filters;

        try {
            let jsonText = filterResponse.text.trim();

            // Remove ```json if Gemini returns markdown
            jsonText = jsonText
                .replace(/^```json\s*/, "")
                .replace(/^```\s*/, "")
                .replace(/```$/, "")
                .trim();

            filters = JSON.parse(jsonText);

        } catch (error) {

            console.error("Filter parsing error:", error);

            filters = {
                isJobSearch: false,
                title: "",
                location: "",
                category: "",
                level: "",
                minSalary: null
            };
        }


      
        //  If this isn't a job search,
        // use normal Gemini conversation
        

        if (!filters.isJobSearch) {

            const contents = history
                .filter(
                    (item) =>
                        item.sender === "user" ||
                        item.sender === "bot"
                )
                .map((item) => ({
                    role: item.sender === "user"
                        ? "user"
                        : "model",

                    parts: [
                        {
                            text: item.text
                        }
                    ]
                }));

            contents.push({
                role: "user",
                parts: [
                    {
                        text: message
                    }
                ]
            });


            const response = await ai.models.generateContent({
                model: MODEL,
                contents
            });


            return res.status(200).json({
                success: true,
                reply: response.text
            });
        }


        
        //  Build MongoDB query
     

        const query = {
            visible: true
        };


        if (filters.title) {
            query.title = {
                $regex: filters.title,
                $options: "i"
            };
        }


        if (filters.location) {
            query.location = {
                $regex: filters.location,
                $options: "i"
            };
        }


        if (filters.category) {
            query.category = {
                $regex: filters.category,
                $options: "i"
            };
        }


        if (filters.level) {
            query.level = {
                $regex: filters.level,
                $options: "i"
            };
        }


        if (
            filters.minSalary !== null &&
            !isNaN(filters.minSalary)
        ) {
            query.salary = {
                $gte: Number(filters.minSalary)
            };
        }


       
        // Search MongoDB
      

        const jobs = await Job.find(query)
            .populate({
                path: "companyId",
                select: "name image"
            })
            .limit(10);


      
        // No jobs found
        

        if (jobs.length === 0) {

            return res.status(200).json({
                success: true,
                reply: "I couldn't find any jobs matching your request. Try changing the job title, location, category, or experience level."
            });
        }


       
        //  Give real jobs to Gemini
     

        const jobData = jobs.map((job) => ({
            id: job._id,
            title: job.title,
            company: job.companyId?.name || "Unknown company",
            location: job.location,
            category: job.category,
            level: job.level,
            salary: job.salary,
            description: job.description
        }));


        const answerPrompt = `
You are the AI assistant for a Job Portal.

The user asked:

"${message}"

These are REAL jobs retrieved from our database:

${JSON.stringify(jobData, null, 2)}

Answer the user using ONLY these jobs.

Important rules:

- Do not invent jobs.
- Do not invent companies.
- Do not change salary values.
- If there are matching jobs, mention the job title, company, location, level and salary.
- Keep the response friendly and concise.
- Tell the user that these jobs are from our Job Portal.
`;


        const answerResponse = await ai.models.generateContent({
            model: MODEL,
            contents: answerPrompt
        });


        return res.status(200).json({
            success: true,
            reply: answerResponse.text,
            jobs: jobData
        });


    } catch (error) {

        console.error("Gemini/Job Search Error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong while processing your request."
        });
    }
}; 