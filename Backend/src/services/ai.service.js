const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the Interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answe this question, what points to cover, what approaches to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the Interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answe this question, what points to cover, what approaches to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        detail: z.string().describe("One short sentence on why this gap matters and how to close it"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of skill gap.")
    })).describe("List of skill gaps in candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in preparationplan e.g. data structures etc"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day")
    })).describe("A day-wise preparation plan for the candidate to follow"),
    title: z.string().describe("The title of the job for which the interview report is being generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Self description: ${selfDescription}
    Job description: ${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(interviewReportSchema)
        }
    })
    return JSON.parse(response.text)

}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" }
    })
    await browser.close()
    return Buffer.from(pdfBuffer)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume Which can be converted to PDF")
    })

    const prompt = `Write a resume in HTML for the candidate below, tailored to the job description.

    Resume: ${resume}
    Self description: ${selfDescription}
    Job description: ${jobDescription}

    Content:
    - Use only information from the candidate's resume and self description. Do not invent details, metrics, links or contact info.
    - Highlight the skills and projects most relevant to the job and use its keywords naturally.
    - Write in plain, human language. Avoid buzzwords like "passionate", "results-driven", "leveraged" or "spearheaded".
    - Start bullet points with a simple action verb and keep them short.
    - Keep the summary to 2-3 lines. Maximum 3-4 bullets per project or job.
    - The resume must fit on one A4 page, so keep it concise and drop weak content.

    Format:
    
    - Single column, ATS friendly. No tables or multi-column layouts.
    - Font: Arial, 10pt body text, line-height 1.35. Name 20pt, section headings 11pt uppercase with a thin bottom border.
    
    

    Return a JSON object with a single key "html" containing the HTML.`

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(resumePdfSchema)
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
}