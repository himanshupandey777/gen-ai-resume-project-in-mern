const  express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../Controllers/interview.controller")
const upload = require ("../middlewares/file.middleware")
const   interviewRouter = express.Router()


/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description, resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)


/**
 * @route GET /api/interview/:interviewId
 * @description Get an interview report by its ID.
 * @access private
 */
interviewRouter.get("/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview
 * @description Get all interview reports for the authenticated user.
 * @access private
 */

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @description Generate a resume PDF based on the user's resume, self-description, and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)
 

module.exports = interviewRouter