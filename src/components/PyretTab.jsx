import { useEffect, useRef, useState } from 'react'
import { create, all } from 'mathjs'
import { validateAI } from '../utils/validateAI'

const math = create(all)

// ─── Safe evaluator ───────────────────────────────────────────────────────────

function evaluateExpression(constant, inputVal) {
  try {
    const x = parseFloat(inputVal)
    const c = parseFloat(constant)
    if (isNaN(x) || isNaN(c)) return null
    return math.evaluate(`x + c`, { x, c })
  } catch {
    return null
  }
}

// ─── Mini Graph ───────────────────────────────────────────────────────────────

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
    if (allPoints.length === 0) return
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

    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.beginPath()
    const [ax0, ay0] = toCanvas(minX, minY)
    const [ax1] = toCanvas(maxX, minY)
    const [, ay1] = toCanvas(minX, maxY)
    ctx.moveTo(ax0, ay0); ctx.lineTo(ax1, ay0)
    ctx.moveTo(ax0, ay0); ctx.lineTo(ax0, ay1)
    ctx.stroke()

    ctx.fillStyle = '#9ca3af'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText("Selvi's age", w / 2, h - 6)
    ctx.save()
    ctx.translate(12, h / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Thamarai's age", 0, 0)
    ctx.restore()

    for (let x = 0; x <= maxX; x += 5) {
      const [cx, cy] = toCanvas(x, minY)
      ctx.fillStyle = '#9ca3af'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(x, cx, cy + 12)
    }

    function drawPointSet(points, dotColor, lineColor) {
      if (points.length === 0) return
      const sorted = [...points].sort((a, b) => a.x - b.x)
      if (points.length >= 2) {
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.45
        ctx.beginPath()
        sorted.forEach(({ x, y }, i) => {
          const [cx, cy] = toCanvas(x, y)
          if (i === 0) ctx.moveTo(cx, cy)
          else ctx.lineTo(cx, cy)
        })
        ctx.stroke()
        ctx.globalAlpha = 1
      }
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
      <canvas
        ref={canvasRef}
        width={240}
        height={200}
        style={{ border: '1px solid #e5e7eb', borderRadius: '6px', display: 'block' }}
      />
    </div>
  )
}

// ─── LCD Panel ────────────────────────────────────────────────────────────────
// No Run button. LCD updates instantly when student types an age.
// Each unique value typed is added as a point to the graph.

function ArduinoLCD({
  simulation, activeConstant,
  originalPoints, setOriginalPoints,
  newRulePoints, setNewRulePoints,
  showGraph, isNewRule,
  originalExpression, newExpression,
  lcdInput, setLcdInput
}) {
  const result = evaluateExpression(activeConstant, lcdInput)

  function handleInputChange(e) {
    const val = e.target.value
    setLcdInput(val)
    const computed = evaluateExpression(activeConstant, val)
    if (computed !== null && val !== '') {
      const point = { x: parseFloat(val), y: computed }
      if (isNewRule) {
        setNewRulePoints(prev => {
          const exists = prev.some(p => p.x === point.x)
          return exists ? prev : [...prev, point]
        })
      } else {
        setOriginalPoints(prev => {
          const exists = prev.some(p => p.x === point.x)
          return exists ? prev : [...prev, point]
        })
      }
    }
  }

  return (
    <div className="arduino-lcd-panel">
      <div className="arduino-lcd-label">⚡ Simulated Output</div>
      <div className="arduino-lcd-screen">
        <div className="lcd-line">{simulation.inputLabel}: {lcdInput || '--'}</div>
        <div className="lcd-line">
          {simulation.outputLabel}: {result !== null && lcdInput !== '' ? result : '--'}
        </div>
      </div>
      <div className="arduino-lcd-controls">
        <input
          type="number"
          value={lcdInput}
          onChange={handleInputChange}
          placeholder="Type Selvi's age"
          className="arduino-lcd-input"
        />
      </div>
      <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
        Type any age — the output updates instantly.
      </p>
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

// ─── Annotated Code Block ─────────────────────────────────────────────────────
// Shows Pyret-style code with line numbers.
// Line 2 has an editable blank. locked=true freezes the blank.

function AnnotatedCodeBlock({ codeLines, fillinValue, setFillinValue, locked }) {
  return (
    <div style={{
      background: '#1e1e2e',
      borderRadius: '8px',
      padding: '16px',
      fontFamily: 'monospace',
      fontSize: '13px',
      lineHeight: '2.2',
      marginBottom: '12px'
    }}>
      {codeLines.map((line, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '2px 8px',
            borderRadius: '4px'
          }}
        >
          <span style={{
            color: '#4b5563',
            fontSize: '11px',
            minWidth: '16px',
            textAlign: 'right',
            userSelect: 'none'
          }}>
            {i + 1}
          </span>

          <span style={{ color: '#e2e8f0', flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {line.hasFillin ? (
              <>
                <span style={{ color: '#f8f8f2' }}>{line.prefix}</span>
                {locked ? (
                  <span style={{
                    color: '#22c55e',
                    background: 'rgba(34,197,94,0.1)',
                    padding: '0 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(34,197,94,0.3)',
                    minWidth: '24px',
                    textAlign: 'center'
                  }}>
                    {fillinValue}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={fillinValue}
                    onChange={e => setFillinValue(e.target.value)}
                    placeholder="?"
                    style={{
                      width: '48px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px dashed #6366f1',
                      borderRadius: '4px',
                      color: '#818cf8',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      padding: '1px 6px',
                      outline: 'none',
                      textAlign: 'center'
                    }}
                  />
                )}
                <span style={{ color: '#f8f8f2' }}>{line.suffix || ''}</span>
              </>
            ) : (
              <span style={{ color: line.color || '#f8f8f2' }}>{line.code}</span>
            )}
          </span>

          {line.annotation && (
            <span style={{
              fontSize: '11px',
              color: '#4b5563',
              fontFamily: 'sans-serif',
              fontStyle: 'italic',
              whiteSpace: 'nowrap'
            }}>
              ← {line.annotation}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main PyretTab ────────────────────────────────────────────────────────────

function PyretTab({ pyret, progress, onUpdateProgress }) {
  const [currentStep, setCurrentStep] = useState(0)

  const [matchAnswers, setMatchAnswers] = useState({})

  const [predictValue, setPredictValue] = useState('')
  const [predictFeedback, setPredictFeedback] = useState(null)

  const [fillinValue, setFillinValue] = useState('')
  const [fillinFeedback, setFillinFeedback] = useState(null)
  const [fillinDone, setFillinDone] = useState(false)
  const [fillinLocked, setFillinLocked] = useState(false)
  const [lcdVisible, setLcdVisible] = useState(false)
  const [showGraph, setShowGraph] = useState(false)

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
  const [lcdInput, setLcdInput] = useState('')
  const [lcdUnlocked, setLcdUnlocked] = useState(false)

  const steps = pyret?.pyretSteps || []
  const codeExplanation = pyret?.codeExplanation || []
  const originalExpression = pyret?.simulation?.expression || 'x + 4'

  const activeConstant = lcdUnlocked && newConstant ? newConstant : '4'
  const currentExpression = lcdUnlocked && newExpression ? newExpression : originalExpression
  const isNewRule = lcdUnlocked && !!newExpression

  const codeLines = [
    {
      code: 'fun thamarai-age(selvi-age):',
      color: '#c084fc',
      annotation: codeExplanation[0]?.explanation || 'defines the rule and its input'
    },
    {
      hasFillin: true,
      prefix: '  selvi-age + ',
      suffix: '',
      annotation: codeExplanation[1]?.explanation || 'your rule — add to get Thamarai\'s age'
    },
    {
      code: 'end',
      color: '#c084fc',
      annotation: codeExplanation[2]?.explanation || 'the rule is finished'
    }
  ]

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

  function handleFillinRun() {
    const step = steps[2]
    const expected = step?.expectedConstant ?? 4
    const entered = parseFloat(fillinValue)

    if (isNaN(entered)) {
      setFillinFeedback({ type: 'hint', message: step?.validation?.hintMessage || 'Type a number.' })
      return
    }
    if (entered !== expected) {
      setFillinFeedback({ type: 'hint', message: step?.validation?.hintMessage || 'Check your table.' })
      return
    }

    setFillinFeedback({ type: 'success', message: step?.validation?.successMessage || 'Correct!' })
    setFillinDone(true)
    setFillinLocked(true)
    setLcdVisible(true)
    setShowGraph(true)
    setCurrentStep(3)
  }

  function handleNewConstantSubmit() {
    const step = steps[3]
    const val = parseFloat(newConstant)
    if (isNaN(val) || val === step?.validation?.excludeValue || val === 0) {
      setNewConstantFeedback({ type: 'hint', message: step?.validation?.hintMessage || 'Try a different number.' })
    } else {
      setNewExpression(`x + ${val}`)
      setNewRulePoints([])
      setLcdInput('')
      setFillinValue(String(val))
      setFillinLocked(false)
      setNewConstantFeedback({ type: 'success', message: `New rule set: x + ${val}` })
      setCurrentStep(4)
    }
  }

  function handleIdentifyAnswer(answer) {
    const step = steps[4]
    setIdentifyAnswer(answer)
    if (answer === step?.validation?.answer) {
      setIdentifyFeedback({ type: 'success', message: step.validation.successMessage })
      setCurrentStep(5)
    } else {
      setIdentifyFeedback({ type: 'hint', message: step?.validation?.hintMessage })
    }
  }

  function handleConfirm() {
    setLcdUnlocked(true)
    setFillinLocked(true)
    setCurrentStep(6)
  }

  async function handleStorySubmit() {
    const step = steps[6]
    setStoryLoading(true)
    const result = await validateAI(
      {
        prompt: step.prompt,
        attemptCount: 0,
        validation: { type: 'open-ended', concept: step.validation.concept }
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

  const confirmPromptText = steps[5]?.promptTemplate?.replace('{number}', newConstant || '?')

  return (
    <div className="panel" role="tabpanel" id="panel-pyret">
      {pyret?.purpose && (
        <div className="pyret-purpose">
          <p>{pyret.purpose}</p>
        </div>
      )}

      <div className="pyret-main-layout">
        <div className="pyret-left">

          {/* Step 1 — Match */}
          <div className="pyret-step">
            <h3>{steps[0]?.title}</h3>
            <p>{steps[0]?.prompt}</p>
            <table className="match-table">
              <tbody>
                {steps[0]?.items?.map(item => (
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
              <h3>{steps[1]?.title}</h3>
              <p>{steps[1]?.prompt}</p>
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

          {/* Step 3 — Fill in the rule */}
          {currentStep >= 2 && (
            <div className="pyret-step">
              <h3>{steps[2]?.title}</h3>
              <p>{steps[2]?.prompt}</p>

              <AnnotatedCodeBlock
                codeLines={codeLines}
                fillinValue={fillinValue}
                setFillinValue={setFillinValue}
                locked={fillinLocked}
              />

              {!fillinDone && (
                <>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    Type the missing number in the blank, then confirm.
                  </p>
                  <button className="pyret-btn" onClick={handleFillinRun}>
                    Confirm rule ↗
                  </button>
                </>
              )}

              {fillinFeedback && (
                <p className={fillinFeedback.type === 'success' ? 'feedback-success' : 'feedback-hint'}>
                  {fillinFeedback.message}
                </p>
              )}

              {currentStep > 2 && (
                <p className="feedback-success">✓ Rule confirmed. Type ages in the LCD to test it.</p>
              )}
            </div>
          )}

          {/* Step 4 — Change the rule */}
          {currentStep >= 3 && (
            <div className="pyret-step">
              <h3>{steps[3]?.title}</h3>
              <p>{steps[3]?.prompt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px' }}>x +</span>
                <input
                  type="number"
                  value={newConstant}
                  onChange={e => setNewConstant(e.target.value)}
                  placeholder={steps[3]?.inputLabel}
                  disabled={currentStep > 3}
                  style={{ width: '80px' }}
                />
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{steps[3]?.hint}</p>
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

          {/* Step 5 — Which line changed */}
          {currentStep >= 4 && (
            <div className="pyret-step">
              <h3>{steps[4]?.title}</h3>
              <p>{steps[4]?.prompt}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {steps[4]?.options?.map(opt => (
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

          {/* Step 6 — Confirm */}
          {currentStep >= 5 && (
            <div className="pyret-step">
              <h3>{steps[5]?.title}</h3>
              <p>{confirmPromptText}</p>
              {currentStep === 5 && (
                <button className="pyret-btn" onClick={handleConfirm}>
                  {steps[5]?.confirmLabel}
                </button>
              )}
              {currentStep > 5 && (
                <>
                  <p className="feedback-success">✓ Code updated</p>
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#1d4ed8' }}>
                      Try your new rule in the LCD — type different ages and watch the output change.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 7 — Story */}
          {currentStep >= 6 && newRulePoints.length >= 1 && (
            <div className="pyret-step">
              <h3>{steps[6]?.title}</h3>
              <p>{steps[6]?.prompt}</p>
              <textarea
                value={storyText}
                onChange={e => setStoryText(e.target.value)}
                placeholder={steps[6]?.placeholder}
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

        {/* Right panel — LCD */}
        <div className="pyret-right">
          {lcdVisible && (
            <ArduinoLCD
              simulation={pyret.simulation}
              activeConstant={activeConstant}
              originalPoints={originalPoints}
              setOriginalPoints={setOriginalPoints}
              newRulePoints={newRulePoints}
              setNewRulePoints={setNewRulePoints}
              showGraph={showGraph}
              isNewRule={isNewRule}
              originalExpression={originalExpression}
              newExpression={newExpression}
              lcdInput={lcdInput}
              setLcdInput={setLcdInput}
            />
          )}
        </div>

      </div>
    </div>
  )
}

export default PyretTab
