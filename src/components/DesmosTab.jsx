import { useEffect, useRef, useState } from 'react'
import PredictionQuestion from './PredictionQuestion'
import BeforeGraphExplanation from './BeforeGraphExplanation'
import PyretBridge from './PyretBridge'

function DesmosTab({ desmos, tablePoints, onPredictionSubmit, predictionMade, userPrediction }) {
  const calculatorRef = useRef(null)
  const containerRef = useRef(null)
  const [showBridge, setShowBridge] = useState(false)
  const [comprehensionAnswer, setComprehensionAnswer] = useState(null)
  const [comprehensionFeedback, setComprehensionFeedback] = useState(null)
  const [desmosReady, setDesmosReady] = useState(false)

  // Poll until Desmos is available
  useEffect(() => {
    if (window.Desmos) {
      setDesmosReady(true)
      return
    }
    const interval = setInterval(() => {
      if (window.Desmos) {
        setDesmosReady(true)
        clearInterval(interval)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!predictionMade || tablePoints.length === 0 || !desmosReady || !containerRef.current) return

    if (calculatorRef.current) {
      calculatorRef.current.destroy()
      calculatorRef.current = null
    }

    calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
      expressions: true,
      settingsMenu: true
    })

    calculatorRef.current.setMathBounds({
      left: 0,
      right: 25,
      bottom: 0,
      top: 30
    })

    // Plot the 4 points from the table
    tablePoints.forEach((point, i) => {
      calculatorRef.current.setExpression({
        id: `table-point-${i}`,
        latex: `(${point.x}, ${point.y})`,
        color: window.Desmos.Colors.BLUE,
        pointSize: 9,
        showLabel: true,
        label: `(${point.x}, ${point.y})`
      })
    })

    // Plot the equation line
    const restrictedExpression = desmos.expression + '\\{x\\geq0\\}'
    calculatorRef.current.setExpression({
      id: 'equation-line',
      latex: restrictedExpression,
      color: window.Desmos.Colors.RED,
      lineWidth: 2
    })

    return () => {
      if (calculatorRef.current) {
        calculatorRef.current.destroy()
        calculatorRef.current = null
      }
    }
  }, [predictionMade, tablePoints, desmos.expression, desmosReady])

  function handleComprehensionCheck() {
    if (comprehensionAnswer === 'Increases') {
      setComprehensionFeedback({
        type: 'success',
        message: 'Correct! As Selvi\'s age increases, Thamarai\'s age also increases. The line goes up from left to right because we are always adding 4.'
      })
    } else {
      setComprehensionFeedback({
        type: 'error',
        message: 'Look at the line again — as you move right (Selvi gets older), does the line go up or down?'
      })
    }
  }

  // Show prediction question first
  if (desmos.prediction?.enabled && !predictionMade) {
    return (
      <div className="panel" role="tabpanel" id="panel-desmos">
        <PredictionQuestion
          prediction={desmos.prediction}
          tablePoints={tablePoints}
          onSubmit={onPredictionSubmit}
        />
      </div>
    )
  }

  // Show message if task not completed yet
  if (tablePoints.length === 0) {
    return (
      <div className="panel" role="tabpanel" id="panel-desmos">
        <div className="task-container">
          <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Complete the Task tab first to unlock the graph.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel" role="tabpanel" id="panel-desmos">
      <div className="desmos-container">

        {desmos.beforeGraph && tablePoints.length > 0 && (
          <BeforeGraphExplanation
            beforeGraph={desmos.beforeGraph}
            tablePoints={tablePoints}
            userPrediction={userPrediction}
          />
        )}

        {!desmosReady ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Loading graph...
          </div>
        ) : (
          <div ref={containerRef} className="desmos" />
        )}

        {!showBridge && (
          <div className="comprehension-section">
            <p className="comprehension-prompt">
              <strong>Look at the graph. What happens to Thamarai's age as Selvi's age increases?</strong>
            </p>

            <div className="radio-options">
              {['Increases', 'Decreases', 'Stays the same'].map(option => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name="comprehension"
                    value={option}
                    checked={comprehensionAnswer === option}
                    onChange={e => setComprehensionAnswer(e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {comprehensionFeedback && (
              <div className={`feedback ${comprehensionFeedback.type}`}>
                {comprehensionFeedback.message}
              </div>
            )}

            {comprehensionFeedback?.type === 'success' ? (
              <button
                className="submit-button"
                onClick={() => setShowBridge(true)}
              >
                Continue →
              </button>
            ) : (
              <button
                className="submit-button"
                onClick={handleComprehensionCheck}
                disabled={!comprehensionAnswer}
              >
                Check Answer
              </button>
            )}
          </div>
        )}

        {showBridge && (
          <PyretBridge
            keyInsight={desmos.afterGraph?.keyInsight?.content}
          />
        )}

      </div>
    </div>
  )
}

export default DesmosTab