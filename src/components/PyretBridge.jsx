import { useState } from 'react'

function PyretBridge({ keyInsight }) {
  const [selectedOption, setSelectedOption] = useState(null)

  const options = [
    {
      label: 'Calculate it by hand',
      response: 'That works! But what if you want to test 10 different ages quickly? It would take a lot of time.'
    },
    {
      label: 'Let the computer do it using your rule',
      response: 'Exactly! You write the rule once and the computer can test any age you give it — instantly.'
    }
  ]

  return (
    <div className="pyret-bridge">

      {/* Key Insight */}
      {keyInsight && (
        <div className="bridge-insight">
          <p className="bridge-insight-text">💡 {keyInsight}</p>
        </div>
      )}

      {/* Bridge Question */}
      <p className="bridge-question">
        The graph showed you the 4 ages you calculated. But what if you want to test an age you have never tried before — instantly?
      </p>

      {/* Options */}
      <div className="bridge-options">
        {options.map((option, i) => (
          <button
            key={i}
            className={`bridge-option-btn ${selectedOption?.label === option.label ? 'selected' : ''}`}
            onClick={() => setSelectedOption(option)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Option Response */}
      {selectedOption && (
        <div className="bridge-option-response">
          <p>{selectedOption.response}</p>
        </div>
      )}

      {/* Follow-up prompt */}
      {selectedOption && (
        <div className="bridge-prompt">
          <p>In the Pyret tab, your rule is already written as code. Try giving it different ages and see what happens.</p>
          <p className="bridge-cta">👉 Click the <strong>Pyret</strong> tab to continue.</p>
        </div>
      )}

    </div>
  )
}

export default PyretBridge