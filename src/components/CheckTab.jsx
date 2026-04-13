import { useState } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  pageBg:      '#f5f3ff',
  cardBg:      '#faf9ff',
  cardBorder:  '#c4b5fd',
  accent:      '#7c3aed',
  accentLight: '#ede9fe',
  accentDark:  '#4c1d95',
  pillBg:      '#ddd6fe',
  pillText:    '#4c1d95',
  promptText:  '#3b0764',
  mutedText:   '#6d28d9',
  successBg:   '#d1fae5',
  successBdr:  '#6ee7b7',
  successText: '#065f46',
  warnBg:      '#fef3c7',
  warnBdr:     '#f59e0b',
  warnText:    '#92400e',
  cardBorder2: '#e9d5ff',
}

const F = {
  pill:    '11px',
  meta:    '14px',
  body:    '17px',
  heading: '22px',
  large:   '20px',
}

const btnStyle = {
  padding: '11px 28px', background: C.accent, color: '#fff',
  border: 'none', borderRadius: '10px', fontSize: '16px',
  fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit',
  transition: 'opacity 0.15s',
}

// ─── Watermark ────────────────────────────────────────────────────────────────
function WatermarkLayer() {
  return (
    <svg aria-hidden="true" style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0, opacity: 0.07,
    }}>
      <defs>
        <pattern id="wm-check" x="0" y="0" width="520" height="520" patternUnits="userSpaceOnUse">
          <text x="30"  y="80"  fontSize="52" fill="#7c3aed" fontFamily="Georgia,serif">x</text>
          <text x="120" y="60"  fontSize="38" fill="#6d28d9" fontFamily="Georgia,serif">+</text>
          <text x="170" y="75"  fontSize="40" fill="#7c3aed" fontFamily="Georgia,serif">4</text>
          <text x="240" y="55"  fontSize="28" fill="#4c1d95" fontFamily="Georgia,serif">=</text>
          <text x="280" y="70"  fontSize="36" fill="#7c3aed" fontFamily="Georgia,serif">y</text>
          <circle cx="80"  cy="160" r="28" fill="none" stroke="#7c3aed" strokeWidth="2"/>
          <polygon points="300,100 330,150 270,150" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
          <text x="10"  y="310" fontSize="42" fill="#6d28d9" fontFamily="Georgia,serif">&#945;</text>
          <rect x="40"  y="350" width="40" height="40" rx="4" fill="none" stroke="#a5b4fc" strokeWidth="2"/>
          <text x="20"  y="470" fontSize="34" fill="#7c3aed" fontFamily="Georgia,serif">f(x)</text>
          <circle cx="380" cy="455" r="16" fill="none" stroke="#7c3aed" strokeWidth="2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm-check)"/>
    </svg>
  )
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ total, current }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? '28px' : '10px',
          height: '10px', borderRadius: '5px',
          background: i < current ? C.successText : i === current ? C.accent : C.cardBorder,
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ pill, children }) {
  return (
    <div style={{
      background: C.cardBg, border: `0.5px solid ${C.cardBorder}`,
      borderRadius: '16px', borderLeft: `4px solid ${C.accent}`,
      padding: '32px 36px', maxWidth: '680px', margin: '0 auto',
      boxShadow: '0 2px 16px rgba(124,58,237,0.08)',
      position: 'relative', zIndex: 1,
    }}>
      {pill && (
        <div style={{
          display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
          background: C.pillBg, color: C.pillText,
          fontSize: F.pill, fontWeight: '600', letterSpacing: '0.05em',
          textTransform: 'uppercase', marginBottom: '12px'
        }}>{pill}</div>
      )}
      {children}
    </div>
  )
}

// ─── Confidence labels + colors ───────────────────────────────────────────────
const CONFIDENCE_LABELS = [
  'I am not sure at all',
  'I kind of understand',
  'I mostly understand',
  'I understand it well',
  'I could explain it to someone else',
]
const CONFIDENCE_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#059669'
]

// ─── Q1: Confidence slider ────────────────────────────────────────────────────
function ConfidenceSlider({ value, onChange }) {
  const pct = ((value - 1) / 4) * 100
  return (
    <div>
      <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '28px', fontWeight: '500' }}>
        How confident do you feel about what you learned today?
      </p>
      <input
        type="range" min="1" max="5" value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{
          width: '100%', height: '6px', appearance: 'none', cursor: 'pointer',
          background: `linear-gradient(to right, ${CONFIDENCE_COLORS[value - 1]} 0%, ${CONFIDENCE_COLORS[value - 1]} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
          borderRadius: '3px', outline: 'none', marginBottom: '8px',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <span key={n} style={{
            fontSize: '13px', fontWeight: '600',
            color: n === value ? CONFIDENCE_COLORS[value - 1] : C.mutedText,
            transition: 'color 0.2s',
          }}>{n}</span>
        ))}
      </div>
      <div style={{
        padding: '14px 20px', borderRadius: '10px', textAlign: 'center',
        background: `${CONFIDENCE_COLORS[value - 1]}18`,
        border: `1.5px solid ${CONFIDENCE_COLORS[value - 1]}`,
        transition: 'all 0.3s',
      }}>
        <span style={{ fontSize: F.large, color: CONFIDENCE_COLORS[value - 1], fontWeight: '500' }}>
          {CONFIDENCE_LABELS[value - 1]}
        </span>
      </div>
    </div>
  )
}

// ─── Q2: CFU ─────────────────────────────────────────────────────────────────
const CFU_OPTIONS = [
  {
    value: 'yes', label: 'Yes', icon: '✓',
    feedback: {
      correct: true,
      message: 'Correct! When x = 100, y = 100 + 4 = 104. The rule works for any value of x. That is what makes it a general equation.'
    }
  },
  {
    value: 'no', label: 'No', icon: '✗',
    feedback: {
      correct: false,
      message: 'Not quite. Try it: when x = 100, y = 100 + 4 = 104. The equation y = x + 4 works for any value of x, even very large ones.'
    }
  },
  {
    value: 'notsure', label: 'Not sure', icon: '?',
    feedback: {
      correct: false,
      message: 'That is honest. Substitute x = 100 into y = x + 4. You get y = 104. The same rule applies no matter what x is.'
    }
  },
]

function CFUQuestion({ selected, onSelect, submitted }) {
  const chosen = CFU_OPTIONS.find(o => o.value === selected)
  return (
    <div>
      <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '8px', fontWeight: '500' }}>
        Does y = x + 4 work when x = 100?
      </p>
      <p style={{ fontSize: F.meta, color: C.mutedText, marginBottom: '24px', fontStyle: 'italic' }}>
        Think it through before you answer.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {CFU_OPTIONS.map(opt => {
          const isSel = selected === opt.value
          return (
            <div key={opt.value}
              onClick={() => !submitted && onSelect(opt.value)}
              style={{
                flex: 1, minWidth: '100px', padding: '18px 12px',
                borderRadius: '12px', textAlign: 'center',
                border: `2px solid ${isSel ? C.accent : C.cardBorder}`,
                background: isSel ? C.accentLight : C.cardBg,
                cursor: submitted ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '6px', color: isSel ? C.accent : C.mutedText }}>
                {opt.icon}
              </div>
              <div style={{ fontSize: F.large, fontWeight: '500', color: isSel ? C.accentDark : C.mutedText }}>
                {opt.label}
              </div>
            </div>
          )
        })}
      </div>
      {submitted && chosen && (
        <div style={{
          padding: '14px 18px', borderRadius: '10px',
          background: chosen.feedback.correct ? C.successBg : C.warnBg,
          border: `0.5px solid ${chosen.feedback.correct ? C.successBdr : C.warnBdr}`,
        }}>
          <p style={{
            fontSize: F.body, margin: 0, lineHeight: '1.6',
            color: chosen.feedback.correct ? C.successText : C.warnText
          }}>
            {chosen.feedback.message}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Q3: Pick what clicked ────────────────────────────────────────────────────
const CLICKED_OPTIONS = [
  {
    value: 'graph',
    icon: '📈',
    label: 'The graph helped me see the pattern',
    color: '#3b82f6',
    colorLight: '#dbeafe',
  },
  {
    value: 'equation',
    icon: '✏️',
    label: 'The equation helped me understand the rule',
    color: '#7c3aed',
    colorLight: C.accentLight,
  },
  {
    value: 'code',
    icon: '💻',
    label: 'The code helped me see it works for any number',
    color: '#059669',
    colorLight: C.successBg,
  },
]

function WhatClicked({ selected, onSelect }) {
  return (
    <div>
      <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '8px', fontWeight: '500' }}>
        Which one helped you understand the most today?
      </p>
      <p style={{ fontSize: F.meta, color: C.mutedText, marginBottom: '24px', fontStyle: 'italic' }}>
        There is no wrong answer. Tap the one that feels most true for you.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {CLICKED_OPTIONS.map(opt => {
          const isSel = selected === opt.value
          return (
            <div key={opt.value}
              onClick={() => onSelect(opt.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 20px', borderRadius: '12px',
                border: `2px solid ${isSel ? opt.color : C.cardBorder}`,
                background: isSel ? opt.colorLight : C.cardBg,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isSel ? `0 2px 12px ${opt.color}22` : 'none',
              }}
            >
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{opt.icon}</span>
              <span style={{
                fontSize: F.body, fontWeight: isSel ? '500' : '400',
                color: isSel ? opt.color : C.mutedText,
                transition: 'color 0.2s',
              }}>
                {opt.label}
              </span>
              {isSel && (
                <span style={{
                  marginLeft: 'auto', width: '22px', height: '22px',
                  borderRadius: '50%', background: opt.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '12px', flexShrink: 0
                }}>&#10003;</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Completion card ──────────────────────────────────────────────────────────
function CompletionCard({ confidence, cfuAnswer, clickedOption }) {
  const cfuCorrect     = cfuAnswer === 'yes'
  const clickedLabel   = CLICKED_OPTIONS.find(o => o.value === clickedOption)
  const clickedColor   = clickedLabel?.color || C.accent

  return (
    <div style={{
      background: C.cardBg, border: `0.5px solid ${C.cardBorder}`,
      borderRadius: '16px', padding: '32px 36px',
      maxWidth: '680px', margin: '0 auto',
      boxShadow: '0 2px 16px rgba(124,58,237,0.08)',
      position: 'relative', zIndex: 1,
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>&#10003;</div>
        <h2 style={{ fontSize: F.heading, fontWeight: '500', color: C.accentDark, margin: 0 }}>
          Exit ticket complete
        </h2>
      </div>

      {/* Journey summary */}
      <div style={{
        background: C.successBg, border: `0.5px solid ${C.successBdr}`,
        borderRadius: '12px', padding: '18px 22px', marginBottom: '22px'
      }}>
        <p style={{ fontSize: F.body, color: C.successText, lineHeight: '1.7', margin: 0 }}>
          You started with a word problem about Priya and Asha. You found the pattern,
          wrote it as an equation, saw it as a graph, and turned it into a function in code.
          Three different representations -- one relationship. That is computational thinking.
        </p>
      </div>

      {/* Response summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Confidence */}
        <div style={{
          padding: '12px 16px', background: C.accentLight,
          borderRadius: '10px', border: `0.5px solid ${C.cardBorder}`
        }}>
          <div style={{ fontSize: F.meta, color: C.mutedText, marginBottom: '4px' }}>Your confidence</div>
          <div style={{ fontSize: F.body, color: C.accentDark, fontWeight: '500' }}>
            {confidence} out of 5 -- {CONFIDENCE_LABELS[confidence - 1]}
          </div>
        </div>

        {/* CFU */}
        <div style={{
          padding: '12px 16px',
          background: cfuCorrect ? C.successBg : C.warnBg,
          borderRadius: '10px',
          border: `0.5px solid ${cfuCorrect ? C.successBdr : C.warnBdr}`
        }}>
          <div style={{ fontSize: F.meta, color: cfuCorrect ? C.successText : C.warnText, marginBottom: '4px' }}>
            Does y = x + 4 work for x = 100?
          </div>
          <div style={{ fontSize: F.body, color: cfuCorrect ? C.successText : C.warnText, fontWeight: '500' }}>
            You answered: {cfuAnswer === 'yes' ? 'Yes' : cfuAnswer === 'no' ? 'No' : 'Not sure'}
            {cfuCorrect ? ' -- correct!' : ' -- worth revisiting with your teacher'}
          </div>
        </div>

        {/* What clicked */}
        {clickedOption && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px',
            background: `${clickedColor}12`,
            border: `0.5px solid ${clickedColor}`,
          }}>
            <div style={{ fontSize: F.meta, color: C.mutedText, marginBottom: '4px' }}>
              What helped you most
            </div>
            <div style={{ fontSize: F.body, color: clickedColor, fontWeight: '500' }}>
              {clickedLabel?.icon} {clickedLabel?.label}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main CheckTab ────────────────────────────────────────────────────────────
function CheckTab({ check, progress, onComplete }) {
  const [question, setQuestion]           = useState(0)
  const [confidence, setConfidence]       = useState(3)
  const [cfuAnswer, setCfuAnswer]         = useState(null)
  const [cfuSubmitted, setCfuSubmitted]   = useState(false)
  const [clickedOption, setClickedOption] = useState(null)

  const TOTAL = 3

  function handleCFUSubmit() {
    if (!cfuAnswer) return
    setCfuSubmitted(true)
  }

  function handleFinish() {
    setQuestion(3)
    if (onComplete) onComplete()
  }

  return (
    <div className="panel" role="tabpanel" id="panel-check"
      style={{ background: C.pageBg, position: 'relative', minHeight: '100%' }}>
      <WatermarkLayer />
      <div className="task-container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Objective */}
        <div style={{
          background: '#1e1b4b', borderRadius: '10px', padding: '14px 20px',
          marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
          <p style={{ fontSize: '15px', color: '#e0e7ff', margin: 0 }}>
            <span style={{ fontWeight: '500', color: '#a5b4fc' }}>Exit ticket: </span>
            Three quick questions to close out today's lesson.
          </p>
        </div>

        {question < 3 && <ProgressDots total={TOTAL} current={question} />}

        {/* ── Q1: Confidence ── */}
        {question === 0 && (
          <Card pill="question 1 of 3">
            <ConfidenceSlider value={confidence} onChange={setConfidence} />
            <button style={{ ...btnStyle, marginTop: '28px' }} onClick={() => setQuestion(1)}>
              Next
            </button>
          </Card>
        )}

        {/* ── Q2: CFU ── */}
        {question === 1 && (
          <Card pill="question 2 of 3">
            <CFUQuestion
              selected={cfuAnswer}
              onSelect={setCfuAnswer}
              submitted={cfuSubmitted}
            />
            {!cfuSubmitted ? (
              <button
                style={{ ...btnStyle, marginTop: '20px', opacity: cfuAnswer ? 1 : 0.5, cursor: cfuAnswer ? 'pointer' : 'not-allowed' }}
                onClick={handleCFUSubmit}
                disabled={!cfuAnswer}
              >
                Submit
              </button>
            ) : (
              <button style={{ ...btnStyle, marginTop: '16px' }} onClick={() => setQuestion(2)}>
                Next
              </button>
            )}
          </Card>
        )}

        {/* ── Q3: What clicked ── */}
        {question === 2 && (
          <Card pill="question 3 of 3">
            <WhatClicked selected={clickedOption} onSelect={setClickedOption} />
            <button
              style={{
                ...btnStyle, marginTop: '24px',
                opacity: clickedOption ? 1 : 0.5,
                cursor: clickedOption ? 'pointer' : 'not-allowed'
              }}
              onClick={handleFinish}
              disabled={!clickedOption}
            >
              Finish
            </button>
          </Card>
        )}

        {/* ── Completion ── */}
        {question === 3 && (
          <CompletionCard
            confidence={confidence}
            cfuAnswer={cfuAnswer}
            clickedOption={clickedOption}
          />
        )}

      </div>
    </div>
  )
}

export default CheckTab
