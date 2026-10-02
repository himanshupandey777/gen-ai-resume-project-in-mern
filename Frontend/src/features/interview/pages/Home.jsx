import "../style/home.scss"
import React,{useState, useRef, useEffect} from "react"
import {useInterview} from "../hooks/useInterview"
import {useNavigate, Link} from "react-router"

const Home = () => {
  const {loading, generateReport, getAllReports, reports} = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [fileName, setFileName] = useState("")
  const resumeInputRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getAllReports()
  }, [])

  const handlegenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })
    if (data) {
        navigate(`/interview/${data._id}`)
    } else {
        alert("Failed to generate report. Please try again.")
    }
  }
  if(loading){
    return (
      <main className="loading-screen">
        <h1>Generating your personalized interview strategy...</h1>
        </main>
    )
  }


  return (
    <main className="home">
      <div className="home-content">
        <header className="page-heading">
          <h1>Create Your Custom <span>Interview Plan</span></h1>
          <p>Let our AI analyze the job requirements and your unique profile to<br className="desktop-break" /> build a winning strategy.</p>
        </header>

        <form className="interview-form">
          <div className="form-columns">
            <section className="job-section" aria-labelledby="job-heading">
              <div className="section-heading">
                <h2 id="job-heading"><span className="heading-icon" aria-hidden="true">▤</span>Target Job Description</h2>
                <span className="tag">Required</span>
              </div>
              <div className="job-field">
                <textarea
                  onChange={(e) => {setJobDescription(e.target.value)}}
                  id="jobDescription"
                  name="job-description"
                  maxLength={5000}
                  placeholder={'Paste the full job description here...\ne.g. “Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...”'}
                />
                <span className="character-count">0 / 5000 chars</span>
              </div>
            </section>

            <section className="profile-section" aria-labelledby="profile-heading">
              <div className="section-heading profile-heading">
                <h2 id="profile-heading"><span className="heading-icon" aria-hidden="true">♙</span>Your Profile</h2>
              </div>

              <div className="resume-field">
                <div className="field-label-row">
                  <label htmlFor="resume">Upload Resume</label>
                  <span className="tag">Best Results</span>
                </div>
                <label className="upload-area" htmlFor="resume">
                  <span className="upload-icon" aria-hidden="true">⇧</span>
                  <span className="upload-title">{fileName ? fileName : "Click to upload or drag & drop"}</span>
                  <span className="upload-hint">{fileName ? "File selected. Click to change." : "PDF only (Max 3MB)"}</span>
                </label>
                <input ref={resumeInputRef} className="visually-hidden" hidden type="file" name="resume" id="resume" accept=".pdf"
                  onChange={(e) => setFileName(e.target.files[0]?.name || "")} />
              </div>

              <div className="or-divider"><span>OR</span></div>

              <div className="description-field">
                <label htmlFor="selfDescription">Quick Self-Description</label>
                <textarea
                  onChange={(e) => {setSelfDescription(e.target.value)}}
                  id="selfDescription"
                  name="self-description"
                  maxLength={1000}
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />
              </div>

              <div className="form-notice" role="note">
                <span className="notice-icon" aria-hidden="true">i</span>
                <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
              </div>
            </section>
          </div>

          <div className="form-footer">
            <p>AI-Powered Strategy Generation <span>·</span> Approx 30s</p>
            <button 
            onClick={handlegenerateReport}
            className="generate-button" type="button"><span aria-hidden="true">★</span>Generate My Interview Strategy</button>
          </div>
        </form>

        {/* recent report list */}
        {reports.length > 0 && (
          <section className="recent-reports">
            <h2>My Recent Interview Plans</h2>
            <div className="report-grid">
              {reports.map((r) => (
                <Link to={`/interview/${r._id}`} className="report-card" key={r._id}>
                  <h3>{r.title}</h3>
                  <p className="report-date">
                    Generated on {new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                  <p className="report-score">Match Score: {r.matchScore}%</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="page-footer">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
        </footer>
      </div>
    </main>
  )
}

export default Home