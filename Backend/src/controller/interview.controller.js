const interviewReportModel = require("../models/interviewReport.model")
const pdfParse = require("pdf-parse");
const {generateInterviewReport , generateResumePdf} = require("../services/ai.service");



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
        return res.status(500).json({
            message: "Error occureed while fetching the report",
            stats: "failed",
            error
        })
    }

}

module.exports.fetchReportById = async function (req, res) {
    try {
        const { interviewId } = req.params

        const interviewReportById = await interviewReportModel.findOne({ _id: interviewId, user: req.user._id });

        if (!interviewReportById) {
            return res.status(500).json({
                message: "Report not FOund",
                status: "failed"
            })
        }

        res.status(200).json({
            message: "Interview Rerport fetched by Id",
            status: "success",
            interviewReportById
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error occureed while fetching the report",
            stats: "failed",
            error
        })
    }
}

module.exports.fetchAllReport = async function (req, res) {
    try {

        const fetchAllReport = await interviewReportModel
            .find({ user: req.user._id })   // correct query
            .sort({ createdAt: -1 })
            .select("-resumeText -selfDescription -jobDescription -__v -technicalQuestion -behavioralQuestion -skillGaps -preparationPlan");

        if (!fetchAllReport || fetchAllReport.length === 0) {
            return res.status(404).json({
                message: "Reports not found",
                status: "failed"
            });
        }

        res.status(200).json({
            message: "Interview Reports fetched successfully",
            status: "success",
            fetchAllReport
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while fetching the reports of a user",
            status: "failed",
            error
        });
    }
}

module.exports.generatePdf = async function (req, res){
    const {interviewReportId} = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if(!interviewReport){
        return res.status(500).json({
            message : "Interview Report Not found",
            status : "failed"
        })
    }

    const {resume , jobDescription, selfDescription} = interviewReport;
    const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription})

     res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
     })

     res.send(pdfBuffer);
     
}


