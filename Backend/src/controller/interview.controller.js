const interviewReportModel = require("../models/interviewReport.model")
const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");



function extractImportantResumeData(text) {
    const skills = text.match(/React|Node\.js|MongoDB|Express|Java|C\+\+|Javascript|HTML|CSS/gi) || [];

    const projects = text.match(/Appwrite Blog|Portfolio Website|Uber App/gi) || [];

    return `
Skills: ${[...new Set(skills)].join(", ")}

Projects: ${[...new Set(projects)].join(", ")}
`;
}

module.exports.generateReport = async function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required",
                status: "failed"
            })
        }


        const { jobDescription, selfDescription } = req.body;

        if (!jobDescription || !selfDescription) {
            return res.status(400).json({
                message: "jobDescription and selfDescription are required",
                status: "failed"
            })
        }


        const resumeText = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();

        const processedResume = extractImportantResumeData(resumeText.text)

        const interviewReportByAi = await generateInterviewReport({
            resume: processedResume,
            jobDescription,
            selfDescription
        })

        const interviewReport = await interviewReportModel.create({
            jobDescription,
            selfDescription,
            resumeText: resumeText.text,
            user: req.user._id,
            ...interviewReportByAi
        })


        res.status(200).json({
            message: "Report Created Successfully",
            status: "success",
            interviewReport
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: "failed"
        })
    }

}