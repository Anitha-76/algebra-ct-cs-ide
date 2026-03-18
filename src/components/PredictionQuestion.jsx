import { useState } from 'react'

function PredictionQuestion({ prediction, tablePoints, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  function handleSubmit() {
    if (selectedOption) {
      setShowFeedback(true)
      setTimeout(() => {
        onSubmit(selectedOption)
      }, 2500)
    }
  }

  const selectedChoice = prediction.options.find(opt => opt.value === selectedOption)

  return (
    <div className="prediction-container">
      <div className="prediction-header">
        <h2>Before We Graph: Make a Prediction! 🤔</h2>
      </div>

      <div className="prediction-content">

        {/* Context */}
        <p className="prediction-context">{prediction.context}</p>

        {/* Points listed as text */}
        <ul className="points-list">
          {prediction.pointsList.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>

        {/* Prediction question */}
        <p className="prediction-prompt"><strong>{prediction.prompt}</strong></p>

        <div className="prediction-options">
          {prediction.options.map(option => (
            <label
              key={option.value}
              className={`prediction-option ${selectedOption === option.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="prediction"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={e => setSelectedOption(e.target.value)}
              />
              <span className="option-label">{option.label}</span>
            </label>
          ))}
        </div>

        {/* Feedback referencing their specific prediction */}
        {showFeedback && selectedChoice && (
          <div className="prediction-feedback">
            <p>
              You predicted: <strong>{selectedChoice.label}</strong>
            </p>
            <p>{selectedChoice.feedback}</p>
            <p className="reveal-message">Revealing the graph now — see if you were right! 👀</p>
          </div>
        )}

        {!showFeedback && (
          <>
            <button
              className="submit-button prediction-submit"
              onClick={handleSubmit}
              disabled={!selectedOption}
            >
              Submit Prediction
            </button>
            <p className="prediction-note">
              There are no wrong predictions! This helps you think like a mathematician.
            </p>
          </>
        )}

      </div>
    </div>
  )
}

export default PredictionQuestion