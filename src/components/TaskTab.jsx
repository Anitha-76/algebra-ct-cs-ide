import { useState } from 'react'
import { validateLocal } from '../utils/validate'
import { validateAI } from '../utils/validateAI'
import TableBridgeStep from './TableBridgeStep'

function TaskTab({ steps, problem, progress, onUpdateProgress, onTableComplete }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState({})
  const [feedback, setFeedback] = useState({})
  const [completed, setCompleted] = useState(false)
  const [confirmationStep, setConfirmationStep] = useState(null)

  function handleAnswerChange(stepId, value) {
    setAnswers(prev => ({ ...prev, [stepId]: value }))
  }

  function handleExpressionBuilderChange(stepId, part, value) {
    setAnswers(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [part]: value
      }
    }))
  }

  async function checkAnswer(step) {
    const userAnswer = answers[step.id]
    const { validation } = step

    const currentProgress = progress[step.id] || {
      attempts: 0,
      hintsUnlocked: 0,
      completed: false
    }

    let result

    if (step.type === 'expression-builder') {
      const operator = userAnswer?.operator || ''
      const constant = userAnswer?.constant || ''

      if (!operator || !constant) {
        setFeedback(prev => ({ ...prev, [step.id]: { type: 'error', message: 'Please select an operator and enter a number.' } }))
        return
      }

      const operatorCorrect = operator === validation.operator
      const constantCorrect = parseInt(constant) === validation.constant

      if (operatorCorrect && constantCorrect) {
        result = { isCorrect: true, message: validation.successMessage }
      } else if (!operatorCorrect) {
        result = { isCorrect: false, message: validation.wrongOperatorMessage }
      } else {
        result = { isCorrect: false, message: validation.wrongConstantMessage }
      }

    } else if (validation.type === 'open-ended' || validation.type === 'expression') {
      setFeedback(prev => ({ ...prev, [step.id]: { type: 'loading', message: 'Checking your answer...' } }))
      const stepWithAttempts = { ...step, attemptCount: currentProgress.attempts }
      result = await validateAI(stepWithAttempts, userAnswer)
    } else {
      result = validateLocal(step, userAnswer)
    }

    if (result.isCorrect) {
      onUpdateProgress(step.id, {
        ...currentProgress,
        attempts: currentProgress.attempts + 1,
        completed: true
      })
      setFeedback(prev => ({ ...prev, [step.id]: { type: 'success', message: result.message } }))

      if (step.type === 'expression-builder' && step.validation.confirmationBox) {
        setConfirmationStep(step.id)
      } else {
        if (step.id < steps.length) {
          setCurrentStep(step.id + 1)
        } else {
          setCompleted(true)
        }
      }
    } else {
      const newAttempts = currentProgress.attempts + 1
      const updates = { attempts: newAttempts, completed: false }

      if (newAttempts >= 2 && validation.hints && validation.hints.length > 0) {
        const nextHintIndex = Math.min(
          currentProgress.hintsUnlocked + 1,
          validation.hints.length
        )
        updates.hintsUnlocked = nextHintIndex
      }

      onUpdateProgress(step.id, { ...currentProgress, ...updates })
      setFeedback(prev => ({ ...prev, [step.id]: { type: 'error', message: result.message } }))
    }
  }

  function handleConfirmationContinue(step) {
    setConfirmationStep(null)
    if (step.id < steps.length) {
      setCurrentStep(step.id + 1)
    } else {
      setCompleted(true)
    }
  }

  function unlockNextHint(step) {
    const stepProgress = progress[step.id] || { hintsUnlocked: 0, attempts: 0 }
    const nextHintIndex = Math.min(
      stepProgress.hintsUnlocked + 1,
      step.validation.hints.length
    )
    onUpdateProgress(step.id, { ...stepProgress, hintsUnlocked: nextHintIndex })
  }

  function renderHints(step) {
    const stepProgress = progress[step.id] || { hintsUnlocked: 0, attempts: 0 }
    if (!step.validation.hints || stepProgress.hintsUnlocked === 0) return null

    return (
      <div className="hint-container">
        <h4 className="hint-title">💡 Hints</h4>
        {step.validation.hints.slice(0, stepProgress.hintsUnlocked).map((hint, index) => (
          <div key={index} className="hint-item">
            <span className="hint-number">Hint {index + 1}:</span>
            <span className="hint-text">{hint}</span>
          </div>
        ))}
        {stepProgress.attempts >= 2 &&
         stepProgress.hintsUnlocked < step.validation.hints.length && (
          <button className="hint-button" onClick={() => unlockNextHint(step)}>
            💡 Need another hint?
          </button>
        )}
        {stepProgress.hintsUnlocked >= step.validation.hints.length && (
          <p className="hint-exhausted">You've unlocked all hints. You can do this! 💪</p>
        )}
      </div>
    )
  }

  function renderInput(step) {
    if (step.type === 'textarea') {
      return (
        <textarea
          className="task-textarea"
          placeholder={step.placeholder}
          rows={3}
          value={answers[step.id] || ''}
          onChange={e => handleAnswerChange(step.id, e.target.value)}
        />
      )
    }

    if (step.type === 'number' || step.type === 'expression') {
      return (
        <input
          type={step.type === 'number' ? 'number' : 'text'}
          className="task-input"
          placeholder={step.placeholder}
          value={answers[step.id] || ''}
          onChange={e => handleAnswerChange(step.id, e.target.value)}
        />
      )
    }

    if (step.type === 'radio') {
      return (
        <div className="radio-options">
          {step.options.map(option => (
            <label key={option} className="radio-option">
              <input
                type="radio"
                name={`step-${step.id}`}
                value={option}
                checked={answers[step.id] === option}
                onChange={e => handleAnswerChange(step.id, e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )
    }

    if (step.type === 'expression-builder') {
      const current = answers[step.id] || {}
      return (
        <div className="expression-builder">
          <div className="expression-builder-parts">
            <span className="expression-part expression-fixed">x</span>
            <select
              className="expression-operator"
              value={current.operator || ''}
              onChange={e => handleExpressionBuilderChange(step.id, 'operator', e.target.value)}
            >
              <option value="" disabled>op</option>
              {step.parts.operatorOptions.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            <input
              type="number"
              className="expression-constant"
              placeholder={step.parts.rightPlaceholder}
              value={current.constant || ''}
              onChange={e => handleExpressionBuilderChange(step.id, 'constant', e.target.value)}
            />
          </div>
          <p className="expression-preview">
            {current.operator && current.constant
              ? `Your expression: x ${current.operator} ${current.constant}`
              : 'Your expression will appear here...'}
          </p>
        </div>
      )
    }

    if (step.type === 'table-bridge') {
      return null
    }
  }

  if (completed) {
    return (
      <div className="panel" role="tabpanel" id="panel-task">
        <div className="task-container">
          <div className="completion-message">
            <h3>🎉 Great Work!</h3>
            <p>You've successfully translated a word problem into an algebraic equation.</p>
            <p><strong>Ready to see this visually? Click the Desmos tab to explore your equation as a graph.</strong></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel" role="tabpanel" id="panel-task">
      <div className="task-container">

        <div className="problem-statement">
          <h2>The Problem</h2>
          <p className="problem-text">{problem.statement}</p>
          <p className="problem-question"><strong>Question:</strong> {problem.question}</p>
        </div>

        <hr className="section-divider" />

        <div className="progress-indicator">
          {steps.map(step => (
            <div
              key={step.id}
              className={`progress-step ${currentStep >= step.id ? 'active' : ''}`}
            >
              {step.id}
            </div>
          ))}
        </div>

        {steps.filter(step => step.id <= currentStep).map((step, index) => (
          <div key={index}>
            {step.id < currentStep ? (
              <div className="task-step task-step-completed" id={`step-${step.id}`}>
                <h3 className="step-title-completed">✓ {step.title}</h3>
              </div>
            ) : (
              step.type === 'table-bridge' ? (
                <TableBridgeStep
                  step={step}
                  onComplete={(points) => {
                    onTableComplete(points)
                    if (step.id < steps.length) {
                      setCurrentStep(step.id + 1)
                    } else {
                      setCompleted(true)
                    }
                  }}
                />
              ) : (
                <div className="task-step" id={`step-${step.id}`}>
                  <h3 className="step-title">{step.title}</h3>
                  <div className="prompt-container">
                    <p className="prompt-question">{step.prompt}</p>
                    {renderInput(step)}

                    {feedback[step.id] && (
                      <div className={`feedback ${feedback[step.id].type}`}>
                        {feedback[step.id].message}
                      </div>
                    )}

                    {confirmationStep === step.id && step.validation.confirmationBox && (
                      <div className="confirmation-box">
                        <p className="confirmation-expression">
                          {step.validation.confirmationBox.expression}
                        </p>
                        <p className="confirmation-message">
                          {step.validation.confirmationBox.message}
                        </p>
                        <button
                          className="submit-button"
                          onClick={() => handleConfirmationContinue(step)}
                        >
                          {step.validation.confirmationBox.buttonLabel}
                        </button>
                      </div>
                    )}

                    {currentStep === step.id && confirmationStep !== step.id && (
                      <>
                        {renderHints(step)}
                        <button
                          className="submit-button"
                          onClick={() => checkAnswer(step)}
                        >
                          Check Answer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ))}

      </div>
    </div>
  )
}

export default TaskTab