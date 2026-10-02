import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api.js"
import { useContext, useState } from "react"
import { InterviewContext } from "../interview.context.jsx"

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const [pdfLoading, setPdfLoading] = useState(false)

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)

        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.error("Error generating interview report:", error)
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.error("Error fetching interview report by ID:", error)
        } finally {
            setLoading(false)
        }
    }

    const getAllReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (error) {
            console.error("Error fetching all interview reports:", error)
        } finally {
            setLoading(false)
        }
    }

    const getresumePdf = async (interviewReportId) => {
    setPdfLoading(true)
    try {
        const response = await generateResumePdf(interviewReportId)
        const url = window.URL.createObjectURL(
            new Blob([response], { type: "application/pdf" })
        )
        const link = document.createElement("a")
        link.href = url
        link.download = `resume_${interviewReportId}.pdf`
        link.target = "_blank"
        link.rel = "noopener"
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => window.URL.revokeObjectURL(url), 60000)
    } catch (error) {
        console.error("Error generating resume PDF:", error)
    } finally {
        setPdfLoading(false)
    }
}

    return { loading, pdfLoading, report, reports, generateReport, getReportById, getAllReports, getresumePdf }
}