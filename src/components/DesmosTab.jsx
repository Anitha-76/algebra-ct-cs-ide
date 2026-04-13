import { useEffect, useRef, useState } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  pageBg:      '#f5f3ff',
  cardBg:      '#faf9ff',
  cardBorder:  '#c4b5fd',
  accent:      '#7c3aed',
  accentLight: '#ede9fe',
  accentMid:   '#a5b4fc',
  accentDark:  '#4c1d95',
  pillBg:      '#ddd6fe',
  pillText:    '#4c1d95',
  promptText:  '#3b0764',
  mutedText:   '#6d28d9',
  successBg:   '#d1fae5',
  successBdr:  '#6ee7b7',
  successText: '#065f46',
  errorBg:     '#fee2e2',
  errorBdr:    '#fca5a5',
  errorText:   '#991b1b',
  btnBg:       '#7c3aed',
  btnText:     '#fff',
}

const F = {
  meta:      '14px',
  body:      '17px',
  heading:   '20px',
  objective: '15px',
  problem:   '16px',
  pill:      '12px',
}

const btnStyle = {
  padding: '11px 26px', background: C.btnBg, color: C.btnText,
  border: 'none', borderRadius: '10px', fontSize: '16px',
  fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit',
}

// ─── Watermark ────────────────────────────────────────────────────────────────
function WatermarkLayer() {
  return (
    <svg aria-hidden="true" style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0, opacity: 0.07,
    }}>
      <defs>
        <pattern id="wm-desmos" x="0" y="0" width="520" height="520" patternUnits="userSpaceOnUse">
          <text x="30"  y="80"  fontSize="52" fill="#7c3aed" fontFamily="Georgia,serif">x</text>
          <text x="120" y="60"  fontSize="38" fill="#6d28d9" fontFamily="Georgia,serif">+</text>
          <text x="170" y="75"  fontSize="40" fill="#7c3aed" fontFamily="Georgia,serif">4</text>
          <text x="240" y="55"  fontSize="28" fill="#4c1d95" fontFamily="Georgia,serif">=</text>
          <text x="280" y="70"  fontSize="36" fill="#7c3aed" fontFamily="Georgia,serif">y</text>
          <text x="440" y="80"  fontSize="44" fill="#7c3aed" fontFamily="Georgia,serif">&#8734;</text>
          <circle cx="80"  cy="160" r="28" fill="none" stroke="#7c3aed" strokeWidth="2"/>
          <circle cx="420" cy="150" r="22" fill="none" stroke="#6d28d9" strokeWidth="1.5"/>
          <polygon points="300,100 330,150 270,150" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
          <text x="10"  y="310" fontSize="42" fill="#6d28d9" fontFamily="Georgia,serif">&#945;</text>
          <text x="260" y="310" fontSize="32" fill="#6d28d9" fontFamily="Georgia,serif">&#8721;</text>
          <rect x="40"  y="350" width="40" height="40" rx="4" fill="none" stroke="#a5b4fc" strokeWidth="2"/>
          <circle cx="260" cy="375" r="18" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
          <text x="20"  y="470" fontSize="34" fill="#7c3aed" fontFamily="Georgia,serif">f(x)</text>
          <circle cx="380" cy="455" r="16" fill="none" stroke="#7c3aed" strokeWidth="2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm-desmos)"/>
    </svg>
  )
}

// ─── Page header ──────────────────────────────────────────────────────────────
function PageHeader({ problem }) {
  return (
    <div style={{ position: 'relative', zIndex: 1, marginBottom: '22px' }}>
      <div style={{
        background: '#1e1b4b', borderRadius: '10px', padding: '14px 20px',
        marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
        <p style={{ fontSize: F.objective, color: '#e0e7ff', margin: 0 }}>
          <span style={{ fontWeight: '500', color: '#a5b4fc' }}>Objective: </span>
          I can represent the relationship y = x + 4 as a graph and connect it to the equation.
        </p>
      </div>
      <div style={{
        background: C.accentLight, border: `0.5px solid ${C.cardBorder}`,
        borderRadius: '12px', padding: '16px 22px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: C.accentDark, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>the problem</div>
        <div style={{ fontSize: F.problem, color: '#1e1b4b', lineHeight: '1.6', marginBottom: '6px' }}>{problem.statement}</div>
        <div style={{ fontSize: F.problem, color: C.accent, fontWeight: '500' }}>{problem.question}</div>
      </div>
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ title, pill, children, style: extraStyle = {} }) {
  return (
    <div style={{
      background: C.cardBg, border: `0.5px solid ${C.cardBorder}`,
      borderRadius: '14px', borderLeft: `4px solid ${C.accent}`,
      padding: '26px 30px', marginBottom: '20px',
      boxShadow: '0 2px 12px rgba(124,58,237,0.06)',
      position: 'relative', zIndex: 1,
      ...extraStyle
    }}>
      {pill && (
        <div style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
          background: C.pillBg, color: C.pillText,
          fontSize: F.pill, fontWeight: '600', letterSpacing: '0.05em',
          textTransform: 'uppercase', marginBottom: '10px'
        }}>{pill}</div>
      )}
      {title && (
        <h3 style={{ fontSize: F.heading, fontWeight: '500', color: C.accentDark, marginBottom: '14px', marginTop: 0 }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

// ─── Prediction question ──────────────────────────────────────────────────────
function PredictionQuestion({ prediction, onSubmit }) {
  const [selected, setSelected]         = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  function handleSubmit() {
    if (!selected) return
    setShowFeedback(true)
    setTimeout(() => onSubmit(selected), 2500)
  }

  const selectedChoice = prediction.options.find(o => o.value === selected)

  return (
    <Card pill="before we graph" title="Make a Prediction">
      <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '14px' }}>
        {prediction.context}
      </p>
      <ul style={{ margin: '0 0 18px 0', padding: '0 0 0 20px' }}>
        {prediction.pointsList.map((point, i) => (
          <li key={i} style={{ fontSize: F.body, color: C.promptText, marginBottom: '6px', lineHeight: '1.5' }}>
            {point}
          </li>
        ))}
      </ul>
      <p style={{ fontSize: F.body, color: C.accentDark, fontWeight: '500', marginBottom: '16px' }}>
        {prediction.prompt}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
        {prediction.options.map(opt => {
          const isSel = selected === opt.value
          return (
            <div key={opt.value} onClick={() => !showFeedback && setSelected(opt.value)} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 18px', borderRadius: '10px',
              border: `2px solid ${isSel ? C.accent : C.cardBorder}`,
              background: isSel ? C.accentLight : C.cardBg,
              cursor: showFeedback ? 'default' : 'pointer', transition: 'all 0.15s',
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${isSel ? C.accent : C.cardBorder}`,
                background: isSel ? C.accent : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isSel && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ fontSize: F.body, color: isSel ? C.accentDark : C.mutedText, fontWeight: isSel ? '500' : '400' }}>
                {opt.label}
              </span>
            </div>
          )
        })}
      </div>
      {showFeedback && selectedChoice ? (
        <div style={{ background: C.accentLight, border: `0.5px solid ${C.cardBorder}`, borderRadius: '10px', padding: '16px 20px' }}>
          <p style={{ fontSize: F.body, color: C.accentDark, marginBottom: '6px' }}>
            You predicted: <strong>{selectedChoice.label}</strong>
          </p>
          <p style={{ fontSize: F.body, color: C.promptText, marginBottom: '6px' }}>{selectedChoice.feedback}</p>
          <p style={{ fontSize: F.meta, color: C.mutedText, fontStyle: 'italic', margin: 0 }}>
            Revealing the graph now. See if you were right!
          </p>
        </div>
      ) : (
        <>
          <button onClick={handleSubmit} disabled={!selected}
            style={{ ...btnStyle, opacity: selected ? 1 : 0.5, cursor: selected ? 'pointer' : 'not-allowed' }}>
            Submit Prediction
          </button>
          <p style={{ fontSize: F.meta, color: C.mutedText, marginTop: '10px', fontStyle: 'italic' }}>
            There are no wrong predictions. This helps you think like a mathematician.
          </p>
        </>
      )}
    </Card>
  )
}

// ─── Partial table: 3 named rows + 47 grayed classmates ──────────────────────
// First 3 rows use Arjun, Kavya, Rohan with their ages from the lesson.
// Rows 4-50 are grayed out to show the scale of the problem.
const NAMED_ROWS = [
  { name: 'Arjun',  age: 7  },
  { name: 'Kavya',  age: 12 },
  { name: 'Rohan',  age: 20 },
]
const CLASSMATE_AGES = [
  9, 11, 8, 13, 10, 14, 7, 12, 9, 11,
  8, 13, 10, 14, 7, 12, 9, 11, 8, 13,
  10, 14, 7, 12, 9, 11, 8, 13, 10, 14,
  7, 12, 9, 11, 8, 13, 10, 14, 7, 12,
  9, 11, 8, 13, 10, 14, 7,
]

function PartialTable() {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '20px', maxHeight: '320px', overflowY: 'auto', borderRadius: '8px', border: `0.5px solid ${C.cardBorder}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <tr style={{ background: C.accent }}>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: F.meta, fontWeight: '600', color: '#fff' }}>Student</th>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: F.meta, fontWeight: '600', color: '#fff' }}>Age (x)</th>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: F.meta, fontWeight: '600', color: '#fff' }}>Sibling's age (x + 4)</th>
          </tr>
        </thead>
        <tbody>
          {/* First 3 rows: named, filled */}
          {NAMED_ROWS.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.cardBg : C.accentLight }}>
              <td style={{ padding: '10px 16px', fontSize: F.body, color: C.promptText, fontWeight: '500' }}>{row.name}</td>
              <td style={{ padding: '10px 16px', fontSize: F.body, color: C.accentDark, fontFamily: 'monospace', fontWeight: '500' }}>{row.age}</td>
              <td style={{ padding: '10px 16px', fontSize: F.body, color: C.successText, fontFamily: 'monospace', fontWeight: '500' }}>{row.age + 4}</td>
            </tr>
          ))}
          {/* Rows 4-50: grayed out */}
          {CLASSMATE_AGES.map((age, i) => (
            <tr key={i + 3} style={{ background: i % 2 === 0 ? '#f8f7ff' : '#f3f0ff', opacity: 0.3 }}>
              <td style={{ padding: '10px 16px', fontSize: F.body, color: C.mutedText }}>Classmate {i + 4}</td>
              <td style={{ padding: '10px 16px', fontSize: F.body, color: C.mutedText, fontFamily: 'monospace' }}>?</td>
              <td style={{ padding: '10px 16px', fontSize: F.body, color: C.mutedText, fontFamily: 'monospace' }}>?</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── 3-Moment Bridge ──────────────────────────────────────────────────────────
function ThreeMomentBridge({ onGoToPyret }) {
  const [moment, setMoment]           = useState(1)
  const [limitChoice, setLimitChoice] = useState(null)

  // ── Moment 1: confirm the rule ───────────────────────────────────────────
  if (moment === 1) {
    return (
      <Card pill="moment 1 of 3" title="You found the rule">
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          background: C.successBg, border: `0.5px solid ${C.successBdr}`,
          borderRadius: '12px', padding: '18px 22px', marginBottom: '18px'
        }}>
          <span style={{ fontSize: '28px' }}>&#10003;</span>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '500', color: '#047857', fontFamily: 'monospace', marginBottom: '4px' }}>
              y = x + 4
            </div>
            <p style={{ fontSize: F.body, color: C.successText, margin: 0 }}>
              You tested it for four different ages. It works every time.
            </p>
          </div>
        </div>
        <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '14px' }}>
          You did the hard thinking. You noticed the pattern, named the variable, and wrote one equation that describes the relationship between any two ages.
        </p>
        <p style={{ fontSize: F.body, color: C.accentDark, fontWeight: '500', marginBottom: '20px' }}>
          But here is a question worth sitting with: how far does that rule actually take you?
        </p>
        <button onClick={() => setMoment(2)} style={btnStyle}>Continue</button>
      </Card>
    )
  }

  // ── Moment 2: the limit reveal ───────────────────────────────────────────
  if (moment === 2) {
    return (
      <Card pill="moment 2 of 3" title="A thought experiment">

        {/* Thought experiment framing */}
        <div style={{
          background: C.accentLight, border: `0.5px solid ${C.cardBorder}`,
          borderRadius: '10px', padding: '16px 20px', marginBottom: '20px'
        }}>
          <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.7', margin: 0 }}>
            You just found the rule: add 4 to get the sibling's age. Now imagine a thought experiment.
            Every student in your class has a sibling who happens to be exactly 4 years older.
            In real life, siblings have different age gaps -- but for this experiment, the gap is always 4.
          </p>
        </div>

        <p style={{ fontSize: F.body, color: C.accentDark, fontWeight: '500', marginBottom: '6px' }}>
          Look around your class. There are 50 students here.
        </p>
        <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '16px' }}>
          How long would it take you to calculate all their sibling ages by hand?
        </p>

        <PartialTable />

        {/* Two-choice buttons */}
        {!limitChoice && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setLimitChoice('hand')}
              style={{
                padding: '11px 22px', fontSize: '16px', fontWeight: '500',
                border: `2px solid ${C.cardBorder}`, borderRadius: '10px',
                background: C.cardBg, color: C.promptText,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
              }}
            >
              I would fill it by hand
            </button>
            <button
              onClick={() => setLimitChoice('faster')}
              style={{
                padding: '11px 22px', fontSize: '16px', fontWeight: '500',
                border: `2px solid ${C.accent}`, borderRadius: '10px',
                background: C.accentLight, color: C.accentDark,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
              }}
            >
              There must be a faster way
            </button>
          </div>
        )}

        {limitChoice === 'hand' && (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              background: C.errorBg, border: `0.5px solid ${C.errorBdr}`,
              borderRadius: '10px', padding: '14px 18px', marginBottom: '16px'
            }}>
              <p style={{ fontSize: F.body, color: C.errorText, margin: 0, lineHeight: '1.6' }}>
                That is 47 more rows. Each one needs a calculation. You would be here a while.
                And what if tomorrow the rule changes? You would have to start all over again.
              </p>
            </div>
            <p style={{ fontSize: F.body, color: C.accentDark, fontWeight: '500', marginBottom: '16px' }}>
              You already have the rule. There is a way to give it to something that never gets tired.
            </p>
            <button onClick={() => setMoment(3)} style={btnStyle}>Show me</button>
          </div>
        )}

        {limitChoice === 'faster' && (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              background: C.successBg, border: `0.5px solid ${C.successBdr}`,
              borderRadius: '10px', padding: '14px 18px', marginBottom: '16px'
            }}>
              <p style={{ fontSize: F.body, color: C.successText, margin: 0, lineHeight: '1.6' }}>
                Exactly. You already have the rule. The question is who -- or what -- does the
                repetitive work so you do not have to.
              </p>
            </div>
            <button onClick={() => setMoment(3)} style={btnStyle}>Continue</button>
          </div>
        )}
      </Card>
    )
  }

  // ── Moment 3: the handoff ────────────────────────────────────────────────
  if (moment === 3) {
    return (
      <Card pill="moment 3 of 3" title="Give the rule to the computer">
        <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '14px' }}>
          You did the hard thinking. You found{' '}
          <strong style={{ fontFamily: 'monospace', color: C.accentDark }}>y = x + 4</strong>.
        </p>
        <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '14px' }}>
          Now give that rule to a program and let it handle all 50 students in under a second.
        </p>
        <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '22px' }}>
          The graph showed you the shape of the relationship. Code turns that relationship into a machine.
          You write the rule once. The computer applies it to anything you give it -- instantly, without errors, every time.
        </p>

        {/* Visual payoff teaser */}
        <div style={{
          background: '#1e1b4b', borderRadius: '12px', padding: '18px 22px',
          marginBottom: '22px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: F.meta, color: '#a5b4fc', marginBottom: '6px' }}>your rule</div>
            <div style={{ fontSize: '20px', fontFamily: 'monospace', color: '#7dff7d', fontWeight: '500' }}>
              y = x + 4
            </div>
          </div>
          <div style={{ fontSize: '28px', color: '#818cf8' }}>&#8594;</div>
          <div>
            <div style={{ fontSize: F.meta, color: '#a5b4fc', marginBottom: '6px' }}>result</div>
            <div style={{ fontSize: '20px', fontFamily: 'monospace', color: '#7dff7d', fontWeight: '500' }}>
              50 answers. 1 second.
            </div>
          </div>
        </div>

        <button onClick={onGoToPyret} style={{ ...btnStyle, fontSize: '17px', padding: '13px 30px' }}>
          Go to Pyret &#8594;
        </button>
      </Card>
    )
  }

  return null
}

// ─── Main DesmosTab ───────────────────────────────────────────────────────────
function DesmosTab({ desmos, problem, tablePoints, onPredictionSubmit, predictionMade, userPrediction, onTabChange }) {
  const calculatorRef = useRef(null)
  const containerRef  = useRef(null)
  const [showBridge, setShowBridge]                       = useState(false)
  const [comprehensionAnswer, setComprehensionAnswer]     = useState(null)
  const [comprehensionFeedback, setComprehensionFeedback] = useState(null)
  const [desmosReady, setDesmosReady]                     = useState(false)

  useEffect(() => {
    if (window.Desmos) { setDesmosReady(true); return }
    const id = setInterval(() => {
      if (window.Desmos) { setDesmosReady(true); clearInterval(id) }
    }, 200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!predictionMade || tablePoints.length === 0 || !desmosReady || !containerRef.current) return
    if (calculatorRef.current) { calculatorRef.current.destroy(); calculatorRef.current = null }

    calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
      expressions: true, settingsMenu: true
    })
    calculatorRef.current.setMathBounds({ left: 0, right: 25, bottom: 0, top: 30 })

    tablePoints.forEach((point, i) => {
      calculatorRef.current.setExpression({
        id: `point-${i}`, latex: `(${point.x}, ${point.y})`,
        color: window.Desmos.Colors.BLUE, pointSize: 9,
        showLabel: true, label: `(${point.x}, ${point.y})`
      })
    })
    calculatorRef.current.setExpression({
      id: 'line', latex: desmos.expression + '\\{x\\geq0\\}',
      color: window.Desmos.Colors.RED, lineWidth: 2
    })

    return () => { if (calculatorRef.current) { calculatorRef.current.destroy(); calculatorRef.current = null } }
  }, [predictionMade, tablePoints, desmos.expression, desmosReady])

  function handleComprehensionCheck() {
    if (comprehensionAnswer === 'Increases') {
      setComprehensionFeedback({
        type: 'success',
        message: "Correct! As Priya's age increases, Asha's age also increases. The line goes up from left to right because we are always adding 4."
      })
    } else {
      setComprehensionFeedback({
        type: 'error',
        message: "Look at the line again. As you move right (Priya gets older), does the line go up or down?"
      })
    }
  }

  // ── Locked ──────────────────────────────────────────────────────────────────
  if (tablePoints.length === 0) {
    return (
      <div className="panel" role="tabpanel" id="panel-desmos"
        style={{ background: C.pageBg, position: 'relative', minHeight: '100%' }}>
        <WatermarkLayer />
        <div className="task-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            marginTop: '3rem', textAlign: 'center', padding: '3rem 2rem',
            background: C.accentLight, border: `0.5px solid ${C.cardBorder}`, borderRadius: '14px',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>&#128274;</div>
            <p style={{ fontSize: F.body, color: C.mutedText, margin: 0 }}>
              Complete the Task tab first to unlock the graph.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Prediction ──────────────────────────────────────────────────────────────
  if (desmos.prediction?.enabled && !predictionMade) {
    return (
      <div className="panel" role="tabpanel" id="panel-desmos"
        style={{ background: C.pageBg, position: 'relative', minHeight: '100%' }}>
        <WatermarkLayer />
        <div className="task-container" style={{ position: 'relative', zIndex: 1 }}>
          {problem && <PageHeader problem={problem} />}
          <PredictionQuestion prediction={desmos.prediction} onSubmit={onPredictionSubmit} />
        </div>
      </div>
    )
  }

  // ── Main graph view ─────────────────────────────────────────────────────────
  return (
    <div className="panel" role="tabpanel" id="panel-desmos"
      style={{ background: C.pageBg, position: 'relative', minHeight: '100%' }}>
      <WatermarkLayer />
      <div className="task-container" style={{ position: 'relative', zIndex: 1 }}>

        {problem && <PageHeader problem={problem} />}

        {/* Side-by-side: table LEFT, graph RIGHT */}
        <div style={{
          display: 'flex', gap: '20px', alignItems: 'flex-start',
          flexWrap: 'wrap', marginBottom: '20px', position: 'relative', zIndex: 1
        }}>
          {/* LEFT: connecting your work */}
          {desmos.beforeGraph && (
            <div style={{
              flex: '0 0 380px', minWidth: '280px',
              background: C.cardBg, border: `0.5px solid ${C.cardBorder}`,
              borderRadius: '14px', borderLeft: `4px solid ${C.accent}`,
              padding: '22px 24px', boxShadow: '0 2px 12px rgba(124,58,237,0.06)',
            }}>
              <div style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                background: C.pillBg, color: C.pillText,
                fontSize: F.pill, fontWeight: '600', letterSpacing: '0.05em',
                textTransform: 'uppercase', marginBottom: '10px'
              }}>connecting your work</div>
              <h3 style={{ fontSize: F.heading, fontWeight: '500', color: C.accentDark, marginBottom: '14px', marginTop: 0 }}>
                {desmos.beforeGraph.title}
              </h3>
              <p style={{ fontSize: F.meta, color: C.promptText, marginBottom: '12px' }}>
                Each row from your table becomes a point on the graph:
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' }}>
                <thead>
                  <tr style={{ background: C.accent }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: F.meta, fontWeight: '600', color: '#fff' }}>Table row</th>
                    <th style={{ padding: '10px 6px', fontSize: F.meta, color: '#fff' }}></th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: F.meta, fontWeight: '600', color: '#fff' }}>Graph point</th>
                  </tr>
                </thead>
                <tbody>
                  {desmos.beforeGraph.tableMapping.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.cardBg : C.accentLight }}>
                      <td style={{ padding: '10px 14px', fontSize: F.body, color: C.promptText }}>{row.tableRow}</td>
                      <td style={{ padding: '10px 6px', fontSize: F.body, color: C.accent, fontWeight: '600', textAlign: 'center' }}>&#8594;</td>
                      <td style={{ padding: '10px 14px', fontSize: F.body, color: C.accentDark, fontFamily: 'monospace', fontWeight: '500' }}>{row.graphPoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {desmos.beforeGraph.legend.map((item, i) => (
                <p key={i} style={{ fontSize: F.meta, color: C.mutedText, margin: '4px 0' }}>{item}</p>
              ))}
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef3c7', borderLeft: `4px solid #f59e0b`, borderRadius: '6px' }}>
                <p style={{ fontSize: F.meta, color: '#92400e', margin: 0, fontWeight: '500' }}>{desmos.beforeGraph.notice}</p>
              </div>
              {userPrediction && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: C.accentLight, border: `0.5px solid ${C.cardBorder}`, borderRadius: '8px' }}>
                  <p style={{ fontSize: F.meta, color: C.accentDark, margin: 0 }}>
                    You predicted: <strong>{userPrediction}</strong>. Does the graph match?
                  </p>
                </div>
              )}
            </div>
          )}

          {/* RIGHT: Desmos graph */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{
              background: C.cardBg, border: `0.5px solid ${C.cardBorder}`,
              borderRadius: '14px', borderLeft: `4px solid ${C.accent}`,
              padding: '22px 24px', boxShadow: '0 2px 12px rgba(124,58,237,0.06)',
            }}>
              <div style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                background: C.pillBg, color: C.pillText,
                fontSize: F.pill, fontWeight: '600', letterSpacing: '0.05em',
                textTransform: 'uppercase', marginBottom: '10px'
              }}>the graph</div>
              <h3 style={{ fontSize: F.heading, fontWeight: '500', color: C.accentDark, marginBottom: '14px', marginTop: 0 }}>y = x + 4</h3>
              {!desmosReady ? (
                <div style={{ textAlign: 'center', padding: '2rem', fontSize: F.body, color: C.mutedText }}>Loading graph...</div>
              ) : (
                <div ref={containerRef} className="desmos" style={{ borderRadius: '8px', overflow: 'hidden' }} />
              )}
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
                <p style={{ fontSize: F.meta, color: C.mutedText, margin: 0 }}>Horizontal (x): Priya's age</p>
                <p style={{ fontSize: F.meta, color: C.mutedText, margin: 0 }}>Vertical (y): Asha's age</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key insight */}
        {desmos.afterGraph?.keyInsight && (
          <div style={{
            background: C.accentLight, border: `0.5px solid ${C.cardBorder}`,
            borderRadius: '12px', padding: '16px 22px', marginBottom: '20px',
            position: 'relative', zIndex: 1,
          }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: C.accentDark, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {desmos.afterGraph.keyInsight.title}
            </div>
            <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.7', margin: 0 }}>
              {desmos.afterGraph.keyInsight.content}
            </p>
          </div>
        )}

        {/* Comprehension question */}
        {!showBridge && (
          <Card pill="explore" title="Look at the graph">
            <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '16px' }}>
              What happens to Asha's age as Priya's age increases?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {['Increases', 'Decreases', 'Stays the same'].map(opt => {
                const isSel    = comprehensionAnswer === opt
                const isLocked = comprehensionFeedback?.type === 'success'
                return (
                  <div key={opt} onClick={() => !isLocked && setComprehensionAnswer(opt)} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '13px 18px', borderRadius: '10px',
                    border: `2px solid ${isSel ? C.accent : C.cardBorder}`,
                    background: isSel ? C.accentLight : C.cardBg,
                    cursor: isLocked ? 'default' : 'pointer', transition: 'all 0.15s',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${isSel ? C.accent : C.cardBorder}`,
                      background: isSel ? C.accent : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSel && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <span style={{ fontSize: F.body, color: isSel ? C.accentDark : C.mutedText, fontWeight: isSel ? '500' : '400' }}>
                      {opt}
                    </span>
                  </div>
                )
              })}
            </div>
            {comprehensionFeedback && (
              <p style={{
                fontSize: F.body, padding: '12px 16px', borderRadius: '10px', marginBottom: '14px',
                color: comprehensionFeedback.type === 'success' ? C.successText : C.errorText,
                background: comprehensionFeedback.type === 'success' ? C.successBg : C.errorBg,
              }}>
                {comprehensionFeedback.message}
              </p>
            )}
            {comprehensionFeedback?.type === 'success' ? (
              <button onClick={() => setShowBridge(true)} style={btnStyle}>Continue</button>
            ) : (
              <button onClick={handleComprehensionCheck} disabled={!comprehensionAnswer}
                style={{ ...btnStyle, opacity: comprehensionAnswer ? 1 : 0.5, cursor: comprehensionAnswer ? 'pointer' : 'not-allowed' }}>
                Check Answer
              </button>
            )}
          </Card>
        )}

        {/* 3-Moment Bridge */}
        {showBridge && (
          <ThreeMomentBridge
            onGoToPyret={() => onTabChange && onTabChange('pyret')}
          />
        )}

      </div>
    </div>
  )
}

export default DesmosTab
