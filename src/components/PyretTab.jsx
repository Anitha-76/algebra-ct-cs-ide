import { useEffect, useRef, useState } from 'react'
import { makeEmbed } from '@ironm00n/pyret-embed/api'
import { validateAI } from '../utils/validateAI'

function MiniGraph({ originalPoints, newRulePoints, originalExpression, newExpression }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const pad = 40

    const allPoints = [...originalPoints, ...newRulePoints]
    const allX = allPoints.map(p => p.x)
    const allY = allPoints.map(p => p.y)
    const minX = Math.min(0, ...allX)
    const maxX = Math.max(20, ...allX)
    const minY = Math.min(0, ...allY)
    const maxY = Math.max(20, ...allY)

    ctx.clearRect(0, 0, w, h)

    function toCanvas(x, y) {
      return [
        pad + ((x - minX) / (maxX - minX)) * (w - 2 * pad),
        h - pad - ((y - minY) / (maxY - minY)) * (h - 2 * pad)
      ]
    }

    // axes
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.beginPath()
    const [ax0, ay0] = toCanvas(minX, minY)
    const [ax1] = toCanvas(maxX, minY)
    const [, ay1] = toCanvas(minX, maxY)
    ctx.moveTo(ax0, ay0); ctx.lineTo(ax1, ay0)
    ctx.moveTo(ax0, ay0); ctx.lineTo(ax0, ay1)
    ctx.stroke()

    // axis labels
    ctx.fillStyle = '#9ca3af'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText("Selvi's age", w / 2, h - 6)
    ctx.save()
    ctx.translate(12, h / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Thamarai's age", 0, 0)
    ctx.restore()

    // x axis tick labels
    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'
    for (let x = 0; x <= maxX; x += 5) {
      const [cx, cy] = toCanvas(x, minY)
      ctx.fillText(x, cx, cy + 12)
    }

    function drawPointSet(points, dotColor, lineColor) {
      if (points.length === 0) return

      // sort by x for line drawing
      const sorted = [...points].sort((a, b) => a.x - b.x)

      // draw connecting line only after 3 points
      if (points.length >= 3) {
        ctx.strokeStyle = lineColor
ctx.lineWidth = 2
ctx.globalAlpha = 0.45
ctx.setLineDash([])
        ctx.beginPath()
        sorted.forEach(({ x, y }, i) => {
          const [cx, cy] = toCanvas(x, y)
          if (i === 0) ctx.moveTo(cx, cy)
          else ctx.lineTo(cx, cy)
        })
        ctx.stroke()
ctx.globalAlpha = 1
      }

      // draw dots and labels
      points.forEach(({ x, y }) => {
        const [cx, cy] = toCanvas(x, y)
        ctx.beginPath()
        ctx.arc(cx, cy, 5, 0, 2 * Math.PI)
        ctx.fillStyle = dotColor
        ctx.fill()
        ctx.fillStyle = '#374151'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(`(${x},${y})`, cx + 7, cy - 4)
      })
    }

    drawPointSet(originalPoints, '#ef4444', '#fca5a5')
    drawPointSet(newRulePoints, '#3b82f6', '#93c5fd')

  }, [originalPoints, newRulePoints])

  const showLegend = originalPoints.length > 0 || newRulePoints.length > 0

  return (
    <div style={{ marginTop: '12px' }}>
      {showLegend && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '6px', fontSize: '11px', color: '#6b7280' }}>
          {originalPoints.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              {originalExpression}
            </span>
          )}
          {newRulePoints.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
              {newExpression}
            </span>
          )}
        </div>
      )}
      {originalPoints.length > 0 && originalPoints.length < 3 && (
        <p style={{ fontSize: '11px', color: '#f97316', margin: '0 0 4px' }}>
          Plot {3 - originalPoints.length} more point{3 - originalPoints.length > 1 ? 's' : ''} to see the line for the original rule.
        </p>
      )}
      {newRulePoints.length > 0 && newRulePoints.length < 3 && (
        <p style={{ fontSize: '11px', color: '#f97316', margin: '0 0 4px' }}>
          Plot {3 - newRulePoints.length} more point{3 - newRulePoints.length > 1 ? 's' : ''} to see the line for your new rule.
        </p>
      )}
      <canvas
        ref={canvasRef}
        width={240}
        height={200}
        style={{ border: '1px solid #e5e7eb', borderRadius: '6px', display: 'block' }}
      />
    </div>
  )
}

function ArduinoLCD({ simulation, expression, onTest, originalPoints, newRulePoints, showGraph, originalExpression, newExpression, lcdInput, setLcdInput, lcdOutput, setLcdOutput }) {

  function evaluate(val) {
    try {
      const x = parseFloat(val)
      if (isNaN(x)) return null
      // eslint-disable-next-line no-new-func
      return Function('x', `return ${expression}`)(x)
    } catch {
      return null
    }
  }

  function handleRun() {
    const val = parseFloat(lcdInput)
    const result = evaluate(val)
    if (result !== null) {
      setLcdOutput(result)
      if (onTest) onTest(val, result)
    }
  }

  return (
    <div className="arduino-lcd-panel">
      <div className="arduino-lcd-label">⚡ Simulated Output</div>
      <div className="arduino-lcd-screen">
        <div className="lcd-line">{simulation.inputLabel}: {lcdInput || '--'}</div>
        <div className="lcd-line">{simulation.outputLabel}: {lcdOutput !== null ? lcdOutput : '--'}</div>
      </div>
      <div className="arduino-lcd-controls">
        <input
          type="number"
          value={lcdInput}
          onChange={e => setLcdInput(e.target.value)}
          placeholder="Enter age"
          className="arduino-lcd-input"
        />
        <button onClick={handleRun} className="arduino-lcd-btn">Run ↗</button>
      </div>
      {showGraph && (
        <MiniGraph
          originalPoints={originalPoints}
          newRulePoints={newRulePoints}
          originalExpression={originalExpression}
          newExpression={newExpression}
        />
      )}
    </div>
  )
}

function PyretTab({ pyret, progress, onUpdateProgress }) {
  const embedRef = useRef(null)
  const containerRef = useRef(null)
  const [currentStep, setCurrentStep] = useState(0)

  const [matchAnswers, setMatchAnswers] = useState({})

  const [predictValue, setPredictValue] = useState('')
  const [predictFeedback, setPredictFeedback] = useState(null)

  const [runAnswer, setRunAnswer] = useState(null)
  const [lcdVisible, setLcdVisible] = useState(false)

  const [newConstant, setNewConstant] = useState('')
  const [newConstantFeedback, setNewConstantFeedback] = useState(null)
  const [newExpression, setNewExpression] = useState(null)

  const [identifyAnswer, setIdentifyAnswer] = useState(null)
  const [identifyFeedback, setIdentifyFeedback] = useState(null)

  const [storyText, setStoryText] = useState('')
  const [storyFeedback, setStoryFeedback] = useState(null)
  const [storyLoading, setStoryLoading] = useState(false)

  const [originalPoints, setOriginalPoints] = useState([])
  const [newRulePoints, setNewRulePoints] = useState([])
  const [showGraph, setShowGraph] = useState(false)
  const [postRuleTests, setPostRuleTests] = useState(0)
  const [lcdInput, setLcdInput] = useState('')
  const [lcdOutput, setLcdOutput] = useState(null)

  const steps = pyret.pyretSteps
  const currentExpression = newExpression || pyret.simulation.expression
  const originalExpression = pyret.simulation.expression

  useEffect(() => {
    if (currentStep === 2 && !embedRef.current && containerRef.current) {
      makeEmbed('pyret-1', containerRef.current).then(embed => {
        embedRef.current = embed
        embed.sendReset({
          editorContents: pyret.starterCode,
          replContents: '',
          definitionsAtLastRun: '',
          interactionsSinceLastRun: []
        })
      })
    }
  }, [currentStep])

  function handleMatchSubmit() {
    const step = steps[0]
    const allCorrect = step.items.every(item => matchAnswers[item.code] === item.match)
    if (allCorrect) {
      setCurrentStep(1)
    } else {
      alert('Some matches are incorrect. Try again.')
    }
  }

  function handlePredictSubmit() {
    const step = steps[1]
    const val = parseFloat(predictValue)
    if (val === step.validation.answer) {
      setPredictFeedback({ type: 'success', message: step.validation.successMessage })
      setCurrentStep(2)
    } else {
      setPredictFeedback({ type: 'hint', message: step.validation.hintMessage })
    }
  }

  function handleRunAnswer(answer) {
  const step = steps[2]
  setRunAnswer(answer)
  if (answer === step.validation.answer) {
    setLcdVisible(true)
    setShowGraph(true)
    setCurrentStep(3)
  } else {
    setRunAnswer(null)
    alert(step.validation.hintMessage)
  }
}

  function handleNewConstantSubmit() {
    const step = steps[3]
    const val = parseFloat(newConstant)
    if (isNaN(val) || val === step.validation.excludeValue || val === 0) {
      setNewConstantFeedback({ type: 'hint', message: step.validation.hintMessage })
    } else {
      setNewExpression(`x + ${val}`)
      setNewRulePoints([])
      setPostRuleTests(0)
      setLcdInput('')
      setLcdOutput(null)
      setNewConstantFeedback({ type: 'success', message: `New rule set: x + ${val}` })
      setCurrentStep(4)
    }
  }

  function handleIdentifyAnswer(answer) {
    const step = steps[4]
    setIdentifyAnswer(answer)
    if (answer === step.validation.answer) {
      setIdentifyFeedback({ type: 'success', message: step.validation.successMessage })
      setCurrentStep(5)
    } else {
      setIdentifyFeedback({ type: 'hint', message: step.validation.hintMessage })
    }
  }

  function handleConfirm() {
    setCurrentStep(6)
  }

  function handleLCDTest(x, y) {
    if (newExpression && currentStep >= 6) {
      const updated = [...newRulePoints, { x, y }]
      setNewRulePoints(updated)
      setPostRuleTests(prev => prev + 1)
    } else {
      setOriginalPoints(prev => [...prev, { x, y }])
    }
  }

  async function handleStorySubmit() {
    const step = steps[6]
    setStoryLoading(true)
    const result = await validateAI(
      {
        prompt: step.prompt,
        attemptCount: 0,
        validation: {
          type: 'open-ended',
          concept: step.validation.concept
        }
      },
      storyText
    )
    setStoryLoading(false)
    if (result.isCorrect) {
      setStoryFeedback({ type: 'success', message: step.validation.successMessage })
      if (onUpdateProgress) onUpdateProgress('pyret', { completed: true, story: storyText })
    } else {
      setStoryFeedback({ type: 'hint', message: result.message || step.validation.hintMessage })
    }
  }

  const confirmPromptText = steps[5]?.promptTemplate?.replace(
    '{number}',
    newConstant || '?'
  )

  return (
    <div className="panel" role="tabpanel" id="panel-pyret">
      {pyret.purpose && (
        <div className="pyret-purpose">
          <p>{pyret.purpose}</p>
        </div>
      )}

      <div className="pyret-main-layout">
        <div className="pyret-left">

          {/* Step 1 — Match */}
          <div className="pyret-step">
            <h3>{steps[0].title}</h3>
            <p>{steps[0].prompt}</p>
            <table className="match-table">
              <tbody>
                {steps[0].items.map(item => (
                  <tr key={item.code}>
                    <td><code>{item.code}</code></td>
                    <td>
                      <select
                        value={matchAnswers[item.code] || ''}
                        onChange={e => setMatchAnswers(prev => ({ ...prev, [item.code]: e.target.value }))}
                        disabled={currentStep > 0}
                      >
                        <option value="">Select...</option>
                        {steps[0].items.map(i => (
                          <option key={i.match} value={i.match}>{i.match}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentStep === 0 && (
              <button className="pyret-btn" onClick={handleMatchSubmit}>Check matches</button>
            )}
            {currentStep > 0 && <p className="feedback-success">✓ Matched correctly</p>}
          </div>

          {/* Step 2 — Predict */}
          {currentStep >= 1 && (
            <div className="pyret-step">
              <h3>{steps[1].title}</h3>
              <p>{steps[1].prompt}</p>
              <input
                type="number"
                value={predictValue}
                onChange={e => setPredictValue(e.target.value)}
                placeholder="Your prediction"
                disabled={currentStep > 1}
              />
              {currentStep === 1 && (
                <button className="pyret-btn" onClick={handlePredictSubmit}>Submit</button>
              )}
              {predictFeedback && (
                <p className={predictFeedback.type === 'success' ? 'feedback-success' : 'feedback-hint'}>
                  {predictFeedback.message}
                </p>
              )}
            </div>
          )}

          {/* Step 3 — Run and verify */}
          {currentStep >= 2 && (
            <div className="pyret-step">
              <h3>{steps[2].title}</h3>
              <p>{steps[2].prompt}</p>
              <div className="pyret-embed-section">
                <div ref={containerRef} className="pyret" />
              </div>
              {currentStep === 2 && (
  <>
    <p style={{ marginTop: '12px' }}>
      {steps[2].confirmPrompt.replace('{answer}', steps[2].expectedAnswer)}
    </p>
    <div className="pyret-radio-group">
      {steps[2].options.map(opt => (
        <button
          key={opt}
          className={`pyret-option-btn ${runAnswer === opt ? 'selected' : ''}`}
          onClick={() => handleRunAnswer(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  </>
)}
{currentStep > 2 && (
  <p className="feedback-success">✓ Function verified — test values in the LCD on the right.</p>
)}
            </div>
          )}

          {/* Step 4 — New rule constant */}
          {currentStep >= 3 && (
            <div className="pyret-step">
              <h3>{steps[3].title}</h3>
              <p>{steps[3].prompt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px' }}>x +</span>
                <input
                  type="number"
                  value={newConstant}
                  onChange={e => setNewConstant(e.target.value)}
                  placeholder={steps[3].inputLabel}
                  disabled={currentStep > 3}
                  style={{ width: '80px' }}
                />
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{steps[3].hint}</p>
              {currentStep === 3 && (
                <button className="pyret-btn" onClick={handleNewConstantSubmit}>Set new rule</button>
              )}
              {newConstantFeedback && (
                <p className={newConstantFeedback.type === 'success' ? 'feedback-success' : 'feedback-hint'}>
                  {newConstantFeedback.message}
                </p>
              )}
            </div>
          )}

          {/* Step 5 — Identify the line */}
          {currentStep >= 4 && (
            <div className="pyret-step">
              <h3>{steps[4].title}</h3>
              <p>{steps[4].prompt}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {steps[4].options.map(opt => (
                  <button
                    key={opt}
                    className={`pyret-option-btn ${identifyAnswer === opt ? 'selected' : ''}`}
                    onClick={() => handleIdentifyAnswer(opt)}
                    disabled={currentStep > 4}
                    style={{ textAlign: 'left' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {identifyFeedback && (
                <p className={identifyFeedback.type === 'success' ? 'feedback-success' : 'feedback-hint'}>
                  {identifyFeedback.message}
                </p>
              )}
            </div>
          )}

          {/* Step 6 — Confirm code update */}
          {currentStep >= 5 && (
            <div className="pyret-step">
              <h3>{steps[5].title}</h3>
              <p>{confirmPromptText}</p>
              {currentStep === 5 && (
                <button className="pyret-btn" onClick={handleConfirm}>
                  {steps[5].confirmLabel}
                </button>
              )}
              {currentStep > 5 && (
                <>
                  <p className="feedback-success">✓ Code updated</p>
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#1d4ed8' }}>
                      Try your new rule in the LCD on the right — test a few values to see how the graph changes.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 7 — Story */}
          {currentStep >= 6 && postRuleTests >= 1 && (
            <div className="pyret-step">
              <h3>{steps[6].title}</h3>
              <p>{steps[6].prompt}</p>
              <textarea
                value={storyText}
                onChange={e => setStoryText(e.target.value)}
                placeholder={steps[6].placeholder}
                rows={4}
                disabled={storyFeedback?.type === 'success'}
              />
              {storyFeedback?.type !== 'success' && (
                <button className="pyret-btn" onClick={handleStorySubmit} disabled={storyLoading}>
                  {storyLoading ? 'Checking...' : 'Submit'}
                </button>
              )}
              {storyFeedback && (
                <p className={storyFeedback.type === 'success' ? 'feedback-success' : 'feedback-hint'}>
                  {storyFeedback.message}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Right: LCD + graph */}
        <div className="pyret-right">
          {lcdVisible && (
            <>
              <ArduinoLCD
                simulation={pyret.simulation}
                expression={currentExpression}
                onTest={handleLCDTest}
                originalPoints={originalPoints}
                newRulePoints={newRulePoints}
                showGraph={showGraph}
                originalExpression={originalExpression}
                newExpression={newExpression}
                lcdInput={lcdInput}
                setLcdInput={setLcdInput}
                lcdOutput={lcdOutput}
                setLcdOutput={setLcdOutput}
              />
              {!newExpression && (
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '10px', lineHeight: '1.5' }}>
                  Testing the original rule. Complete Step 4 to set a new rule.
                </p>
              )}
              {newExpression && (
                <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '10px', lineHeight: '1.5' }}>
                  LCD updated — now using: {newExpression}
                </p>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default PyretTab