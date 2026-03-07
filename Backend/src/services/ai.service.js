const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate matches the job description."),
    technicalQuestion: z.array(z.object({
        question: z.string().describe("A technical question relevant to the job description and can be asked in the interview."),
        intention: z.string().describe("The intention of the interviewer behind the technical question."),
        answer: z.string().describe("How to answer this question , what points to conver and what approach should the user follow to answer the question")
    }).describe("Technical questions that can be asked in the interview along with the intention behind the question and what approach to follow to answer the question")),
    behavioralQuestion: z.array(z.object({
        question: z.string().describe("A behavioral question relevant to the job description and can be asked in the interview."),
        intention: z.string().describe("The intention of the interviewer behind the behavioral question."),
        answer: z.string().describe("How to answer this question , what points to conver and what approach should the user follow to answer the question")
    }).describe("Behavioral questions that can be asked in the interview along with the intention behind the question and what approach to follow to answer the question")),
    skillGaps: z.array(z.object({
        skill: z.string().describe("A skill that the candidate is lacking based on the job description and self description."),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, indicating how critical it is for the candidate to improve this skill in order to be a strong fit for the job.")
    }).describe("Skill gaps that the candidate has based on the job description and self description along with the severity of the skill gap")),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number on the preparation plan, starting from day 1"),
        focus: z.string().describe("The focus area for the preparation activity on that day. ex : technical skills, behavioral skills, resume improvement etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan effectively")
    }).describe("A day-wise plan for preparing the candidate for the interview, including activities, duration, and required resources."))
})




async function generateInterviewReport({ jobDescription, selfDescription, resume }) {

    const prompt = `
You are an interview preparation assistant.

Analyze the following information:

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

RESUME:
${resume}

Generate an interview preparation report.

Return ONLY valid JSON that matches this structure:

{
  "matchScore": number,
  "technicalQuestion": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestion": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ]
}

Rules:
- Do not add extra fields
- Do not rename fields
- Output ONLY JSON
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.2
        }
    })

    const raw = response.text

    let parsed

    try {
        parsed = JSON.parse(raw)
    } catch (err) {
        throw new Error("AI did not return valid JSON")
    }

    const validated = interviewReportSchema.parse(parsed)
   console.dir(validated, {depth : null})
   return validated;
}


module.exports = generateInterviewReport