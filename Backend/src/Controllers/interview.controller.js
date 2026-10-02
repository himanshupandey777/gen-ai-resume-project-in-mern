const pdfParse = require("pdf-parse")
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Generates an interview report based on the user's resume, self-description, and job description.
 */
async function generateInterviewReportController(req,res){
   

    const resumeContent = (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription, jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume : (await resumeContent).text,
        selfDescription,
        jobDescription
    })
    console.log("AI RESULT:", JSON.stringify(interviewReportByAi, null, 2))
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: (await resumeContent).text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}
/**
 * @description Retrieves an interview report by its ID.
 */
async function getInterviewReportByIdController(req,res){
    const {interviewId} = req.params

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

    if(!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    res.status(200).json({
        message: "Interview report retrieved successfully",
        interviewReport
    })
}

/**
 * @description Retrieves all interview reports for the authenticated user.
 */
async function getAllInterviewReportsController(req,res){
    const interviewReports = await interviewReportModel.find({user: req.user.id})
    .sort({createdAt: -1})
    .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });
    }

/**
 * @descrption controller to generate a resume PDF based on the user's resume, self-description, and job description.
 */
async function generateResumePdfController(req,res){
    const {interviewReportId} = req.params
    
    const interviewReport = await interviewReportModel.findById(interviewReportId)
    if(!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    const {resume, selfDescription, jobDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription})
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume_${interviewReportId}.pdf"`,
        'Content-Length': pdfBuffer.length
    })
    res.send(pdfBuffer)
}

module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}