import "../style/interview.scss"
import { useEffect } from "react"
import { useParams } from "react-router"
import { useInterview } from "../hooks/useInterview"


const QuestionList = ({ title, questions, id, numberOffset = 0 }) => (
  <section className="report-section" id={id}>
    <div className="report-section-heading">
      <div>
        <span className="section-kicker">PRACTICE SET</span>
        <h2>{title}</h2>
      </div>
      <span className="question-total">{questions.length} questions</span>
    </div>
    <div className="question-list">
      {questions.map((item, index) => (
        <article className="question-card" key={item.question}>
          <div className="question-number">{String(index + numberOffset + 1).padStart(2, "0")}</div>
          <div className="question-copy">
            <h3>{item.question}</h3>
            <p className="question-intention"><strong>What they're looking for</strong>{item.intention}</p>
            <div className="suggested-answer">
              <strong>Answer direction</strong>
              <p>{item.answer}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
)

function getMatchTier(score) {
  if (score < 30) {
    return {
      label: "Needs significant work",
      copy: "There's a notable gap between your profile and this role. Focus heavily on the skill gaps before applying."
    }
  }
  if (score <= 60) {
    return {
      label: "Moderate alignment",
      copy: "Your profile partially matches this role. Target the skill gaps below to strengthen your fit."
    }
  }
  return {
    label: "Strong role alignment",
    copy: "Your profile is a good match. Focus on the skill gaps to sharpen your preparation."
  }
}

const Interview = () => {
    const { interviewId } = useParams()
    const { report, loading, pdfLoading, getReportById, getresumePdf } = useInterview()

    useEffect(() => {
      getReportById(interviewId)
    }, [interviewId])

    if (loading || !report) {
      return (
        <main className="loading-screen">
          <h1>Loading your interview strategy...</h1>
        </main>
      )
    }

    const matchTier = getMatchTier(report.matchScore)

  return (
    <main className="interview-page">
      <aside className="interview-sidebar" aria-label="Interview plan sections">
        <a className="report-brand" href="#overview"><span aria-hidden="true">✳</span> Interview Plan</a>
        <div className="sidebar-label">YOUR PREPARATION</div>
        <nav className="section-nav">
          <a href="#technical-questions"><span aria-hidden="true">⌘</span>Technical questions</a>
          <a href="#behavioral-questions"><span aria-hidden="true">◌</span>Behavioral questions</a>
          <a href="#roadmap"><span aria-hidden="true">▤</span>Road Map</a>
        </nav>
        <button
          type="button"
          className="button primary-button download-resume-button"
          onClick={() => getresumePdf(interviewId)}
          disabled={pdfLoading}
        >
          {pdfLoading ? "Generating PDF..." : "Download Resume"}
        </button>
        <div className="sidebar-bottom">
          <span className="sidebar-status-dot" /> Your plan is ready
        </div>
      </aside>

      <div className="report-main" id="overview">
        <header className="report-header">
          <div>
            <span className="section-kicker">PERSONALIZED PREPARATION</span>
            <h1>Your interview strategy</h1>
            <p>A focused plan to help you walk into your next interview prepared.</p>
          </div>
          <a className="back-link" href="/">← <span>New plan</span></a>
        </header>

        <div className="report-content">
          <div className="match-banner">
            <div className="match-score"><strong>{report.matchScore}</strong><span>%</span></div>
            <div className="match-copy">
              <strong>{matchTier.label}</strong>
              <span>{matchTier.copy}</span>
            </div>
            <div className="match-meter" aria-label={`${report.matchScore}% match`}>
              <span style={{ width: `${report.matchScore}%` }} />
            </div>
          </div>

          <QuestionList title="Technical questions" questions={report.technicalQuestions} id="technical-questions" />
          <QuestionList title="Behavioral questions" questions={report.behavioralQuestions} id="behavioral-questions" numberOffset={report.technicalQuestions.length} />

          <section className="report-section roadmap-section" id="roadmap">
            <div className="report-section-heading">
              <div>
                <span className="section-kicker">FOUR-DAY SPRINT</span>
                <h2>Your preparation road map</h2>
              </div>
              <span className="question-total">{report.preparationPlan.length} days</span>
            </div>
            <div className="roadmap-list">
              {report.preparationPlan.map((day) => (
                <article className="roadmap-day" key={day.day}>
                  <span className="day-number">{String(day.day).padStart(2, "0")}</span>
                  <div className="day-content">
                    <span className="day-label">DAY {day.day}</span>
                    <h3>{day.focus}</h3>
                    <ul>{day.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <aside className="insights-panel" aria-label="Interview insights">
        <section className="insight-block">
          <span className="section-kicker">PROFILE SNAPSHOT</span>
          <div className="compact-score"><strong>{report.matchScore}</strong><span>% match</span></div>
          <div className="compact-meter" aria-hidden="true"><span style={{ width: `${report.matchScore}%` }} /></div>
          <p>{matchTier.copy}</p>
        </section>

        <section className="insight-block skill-block">
          <div className="insight-heading">
            <div>
              <span className="section-kicker">AREAS TO STRENGTHEN</span>
              <h2>Skill gaps</h2>
            </div>
            <span className="gap-count">{report.skillGaps.length}</span>
          </div>
          <ul className="skill-list">
            {report.skillGaps.map((gap) => (
              <li className="skill-item" key={gap.skill}>
                <span className={`severity-dot ${gap.severity}`} />
                <span className="skill-copy"><strong>{gap.skill}</strong><small>{gap.detail}</small></span>
                <span className={`severity-label ${gap.severity}`}>{gap.severity}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="insight-block quick-links">
          <span className="section-kicker">JUMP TO</span>
          <a href="#technical-questions">Technical practice <span>↗</span></a>
          <a href="#behavioral-questions">Behavioral practice <span>↗</span></a>
          <a href="#roadmap">Preparation road map <span>↗</span></a>
        </section>
      </aside>
    </main>
  )
}

export default Interview