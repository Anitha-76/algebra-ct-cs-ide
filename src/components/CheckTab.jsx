import { useState } from 'react'

function CheckTab({ check, progress, onComplete }) {

  const [answers, setAnswers] = useState({})      // stores answers by question id
  const [submitted, setSubmitted] = useState(false) // tracks if form was submitted

  function handleAnswerChange(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }


function handleSubmit() {
  const allAnswered = check.questions.every(q =>
    answers[q.id]?.trim().length > 0
  )
  if (allAnswered) {
    setSubmitted(true)
    onComplete() // add this line
  } else {
    alert('Please answer all questions before submitting.')
  }
}

  if (submitted) {
  // Analyze which steps user struggled with
  const struggledSteps = Object.entries(progress)
    .filter(([stepId, data]) => data.attempts > 2)
    .map(([stepId]) => parseInt(stepId))
  
  const totalAttempts = Object.values(progress).reduce(
    (sum, data) => sum + (data.attempts || 0), 
    0
  )
  
  const hintsUsed = Object.values(progress).reduce(
    (sum, data) => sum + (data.hintsUnlocked || 0), 
    0
  )

  return (
    <div className="panel" role="tabpanel" id="panel-check">
      <div className="task-container">
        <div className="completion-message">
          <h3>🎉 Reflection Complete!</h3>
          <p>You've connected all three representations — expression, graph, and code.</p>
          
          {/* Show personalized learning insights */}
          {Object.keys(progress).length > 0 && (
            <div className="learning-insights">
              <h4>📊 Your Learning Journey:</h4>
              
              <div className="insight-item">
                <strong>Total attempts:</strong> {totalAttempts}
              </div>
              
              {hintsUsed > 0 && (
                <div className="insight-item">
                  <strong>Hints used:</strong> {hintsUsed}
                  <p className="insight-note">
                    Using hints is smart! They help you learn without giving away the answer.
                  </p>
                </div>
              )}
              
              {struggledSteps.length > 0 && (
                <div className="insight-item">
                  <strong>Challenging steps:</strong> {struggledSteps.join(', ')}
                  <p className="insight-note">
                    It's normal to need multiple attempts. That's how deep learning happens! 
                    Consider reviewing the Desmos graph or Pyret code for those concepts.
                  </p>
                </div>
              )}
              
              {struggledSteps.length === 0 && totalAttempts <= 4 && (
                <div className="insight-item insight-success">
                  <strong>⭐ Excellent work!</strong>
                  <p className="insight-note">
                    You completed all steps with minimal attempts. You really understand this concept!
                  </p>
                </div>
              )}
            </div>
          )}
          
          <p><strong>Great work completing the lesson!</strong></p>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="panel" role="tabpanel" id="panel-check">
      <div className="task-container">

        <div className="problem-statement">
          <h2>Reflection</h2>
          <p className="problem-text">
            Think about what you learned across all three tabs — Task, Desmos, and Pyret.
          </p>
        </div>

        <hr className="section-divider" />

        {/* Render each reflection question from JSON */}
        {check.questions.map((question, index) => (
          <div key={question.id} className="task-step">
            <h3 className="step-title">Question {index + 1}</h3>
            <div className="prompt-container">
              <p className="prompt-question">{question.prompt}</p>
              <textarea
                className="task-textarea"
                placeholder={question.placeholder}
                rows={4}
                value={answers[question.id] || ''}
                onChange={e => handleAnswerChange(question.id, e.target.value)}
              />
            </div>
          </div>
        ))}

        <button className="submit-button" onClick={handleSubmit}>
          Submit Reflection
        </button>

      </div>
    </div>
  )
}

export default CheckTab