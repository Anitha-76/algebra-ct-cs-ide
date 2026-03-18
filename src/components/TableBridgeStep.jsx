import { useState } from 'react'
import { validateLocal } from '../utils/validate'
import { validateAI } from '../utils/validateAI'

function TableBridgeStep({ step, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [feedback, setFeedback] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)

  const currentQuestion = step.questions[currentQuestionIndex]

  function handleAnswerChange(value) {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
  }

  async function handleCheckAnswer() {
    const userAnswer = answers[currentQuestion.id]
    const { validation } = currentQuestion

    let result

    if (validation.type === 'expression' || validation.type === 'open-ended') {
      setFeedback(prev => ({ ...prev, [currentQuestion.id]: { type: 'loading', message: 'Checking...' } }))
      result = await validateAI(currentQuestion, userAnswer)
    } else {
      result = validateLocal(currentQuestion, userAnswer)
    }

    if (result.isCorrect) {
      // Check if this is a variable naming question and student chose something other than y
      if (
        validation.targetVariable &&
        result.chosenVariable &&
        result.chosenVariable !== validation.targetVariable
      ) {
        setFeedback(prev => ({
          ...prev,
          [currentQuestion.id]: { type: 'nudge', message: validation.nudgeMessage }
        }))
      } else {
        setFeedback(prev => ({
          ...prev,
          [currentQuestion.id]: { type: 'success', message: result.message }
        }))
        if (currentQuestionIndex < step.questions.length - 1) {
          setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
          }, 1000)
        } else {
          setAllQuestionsAnswered(true)
        }
      }
    } else {
      setFeedback(prev => ({
        ...prev,
        [currentQuestion.id]: { type: 'error', message: result.message }
      }))
    }
  }

  function handleContinue() {
    const points = step.table.rows
      .filter(row => typeof row.input === 'number')
      .map(row => {
        const match = row.calculation.match(/=\s*(\d+)\s*$/)
        return { x: row.input, y: match ? parseInt(match[1]) : null }
      })
      .filter(point => point.y !== null)

    onComplete(points)
  }

  return (
    <div className="task-step table-bridge-step" id={`step-${step.id}`}>
      <h3 className="step-title">{step.title}</h3>

      <div className="prompt-container">
        <p className="prompt-question">{step.prompt}</p>

        {/* Table */}
        <div className="table-container">
          <table className="pattern-table">
            <thead>
              <tr>
                {step.table.headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {step.table.rows.map((row, i) => (
                <tr key={i} className={row.input === 'x' ? 'variable-row' : ''}>
                  <td className="input-cell">{row.input}</td>
                  <td className="calculation-cell">{row.calculation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Guided questions */}
        {!allQuestionsAnswered && (
          <div className="guided-questions">
            <div className="question-block">
              <p className="question-prompt">
                <strong>Question {currentQuestionIndex + 1}:</strong> {currentQuestion.prompt}
              </p>

              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  className="task-input"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ''}
                  onChange={e => handleAnswerChange(e.target.value)}
                />
              )}

              {currentQuestion.type === 'open-ended' && (
                <textarea
                  className="task-textarea"
                  placeholder={currentQuestion.placeholder}
                  rows={3}
                  value={answers[currentQuestion.id] || ''}
                  onChange={e => handleAnswerChange(e.target.value)}
                />
              )}

              {currentQuestion.type === 'radio' && (
                <div className="radio-options">
                  {currentQuestion.options.map(option => (
                    <label key={option} className="radio-option">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={e => handleAnswerChange(e.target.value)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {feedback[currentQuestion.id] && (
                <div className={`feedback ${feedback[currentQuestion.id].type}`}>
                  {feedback[currentQuestion.id].message}
                </div>
              )}

              {!feedback[currentQuestion.id]?.type?.includes('success') && (
                <button className="submit-button" onClick={handleCheckAnswer}>
                  Check Answer
                </button>
              )}
            </div>
          </div>
        )}

        {/* Conclusion */}
        {allQuestionsAnswered && (
          <div className="conclusion-box">
            <p className="conclusion-message">{step.conclusion.message}</p>
            <div className="equation-display">
              <strong>{step.conclusion.equation}</strong>
            </div>
            <p className="next-step-hint">{step.conclusion.nextStep}</p>
            <button className="submit-button" onClick={handleContinue}>
              Continue to Next Step
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TableBridgeStep