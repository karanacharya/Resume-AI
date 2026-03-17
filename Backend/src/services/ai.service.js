const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer");


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
  }).describe("A day-wise plan for preparing the candidate for the interview, including activities, duration, and required resources.")),
  title: z.string().describe("The title of the job for which this interview Report is being Generated")
})



/**
 * This is the ai function which generates the interview Report.
 * @param {JobDescription , selfDescription, resume} param 
 * @returns the report.
 */
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
  "title: String,
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
  return validated;
}



async function convertHtmlToPdf(htmlContent) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });

  await browser.close();

  return pdfBuffer;
}



/**
 * This is the function to generate a resume based on the users input 
 * @param {jobDescription , selfDescription, resume}
 */
async function generateResumePdf({ jobDescription, selfDescription, resume }) {

  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume that can be converted to PDF and should be ATS friendly and well formatted by using any library such as puppeteer or any other library to generate the PDF resume.")
  })


  const prompt = `You are a resume generater assistant.
   the user will provide you his resume along with the job description and self description. what you have to do is that you have to generate the html context which can later be converted to pdf using any library such as puppeteer, keeping in mind that the html content generated should be based on the users given job profile (the profile for which the users wants to apply and u have to generate the html content for that profile)
   Now Here are the data provided by the user Resume :${resume} jobDescription : ${jobDescription},
   selfDescription : ${selfDescription}
   Now generate the html content for the resume based on the above data and make sure that the generated resume is ATS friendly and well formatted and in json format as below :
  {
  "html": String
  }
  `

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

  //validate Json structure
  const validated = resumePdfSchema.parse(parsed)

  //Extract html 
  const html = validated.html;

  //Convert HTML to PDF
  const pdfBuffer = await convertHtmlToPdf(html);


  return pdfBuffer;

}












module.exports = { generateInterviewReport, generateResumePdf }