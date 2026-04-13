import { useState } from 'react'
import { validateLocal } from '../utils/validate'
import { validateAI } from '../utils/validateAI'

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
  doneBg:      '#ede9fe',
  doneText:    '#5b21b6',
  btnBg:       '#7c3aed',
  btnText:     '#fff',
}

// ─── Font scale (all sizes in one place for easy future tweaking) ─────────────
const F = {
  pill:       '12px',   // step pill label
  label:      '13px',   // sidebar step titles, small labels
  meta:       '14px',   // muted helper text, italic instructions
  body:       '17px',   // main prompt text, feedback messages
  stepTitle:  '20px',   // step card h3
  input:      '18px',   // text inputs and textareas
  numberInput:'22px',   // number input (Step 3)
  tileLabel:  '20px',   // expression tiles
  nlCircle:   '15px',   // number line circles
  nlLabel:    '14px',   // number line row labels
  conclusion: '24px',   // equation in conclusion box
  objective:  '15px',   // objective banner text
  problem:    '16px',   // problem statement text
  trackerDot: '12px',   // step tracker numbers
  trackerLbl: '11px',   // step tracker labels
}

// ─── Step 1 keyword validation ────────────────────────────────────────────────
const OLDER_KEYWORDS = [
  'older','elder','more','bigger','greater','larger',
  'higher','senior','aged','ahead','above','extra',
  'plus','added','increase','grown','mature'
]
function validateStep1(answer) {
  if (!answer || answer.trim().length < 2)
    return { isCorrect: false, message: 'Please type something first.' }
  const lower = answer.toLowerCase()
  if (OLDER_KEYWORDS.some(kw => lower.includes(kw)))
    return { isCorrect: true, message: 'Good thinking! Older means more, so we add.' }
  return { isCorrect: false, message: 'Think about what "older" tells you about the size of a number. Is it bigger or smaller?' }
}

// ─── Watermark ────────────────────────────────────────────────────────────────
function WatermarkLayer() {
  return (
    <svg aria-hidden="true" style={{
      position:'absolute', top:0, left:0, width:'100%', height:'100%',
      pointerEvents:'none', zIndex:0, opacity:0.07,
    }}>
      <defs>
        <pattern id="wm" x="0" y="0" width="520" height="520" patternUnits="userSpaceOnUse">
          <text x="30"  y="80"  fontSize="52" fill="#7c3aed" fontFamily="Georgia,serif">x</text>
          <text x="120" y="60"  fontSize="38" fill="#6d28d9" fontFamily="Georgia,serif">+</text>
          <text x="170" y="75"  fontSize="40" fill="#7c3aed" fontFamily="Georgia,serif">4</text>
          <text x="240" y="55"  fontSize="28" fill="#4c1d95" fontFamily="Georgia,serif">=</text>
          <text x="280" y="70"  fontSize="36" fill="#7c3aed" fontFamily="Georgia,serif">y</text>
          <text x="340" y="50"  fontSize="22" fill="#6d28d9" fontFamily="Georgia,serif">x+4</text>
          <text x="440" y="80"  fontSize="44" fill="#7c3aed" fontFamily="Georgia,serif">&#8734;</text>
          <circle cx="80"  cy="160" r="28" fill="none" stroke="#7c3aed" strokeWidth="2"/>
          <circle cx="200" cy="140" r="14" fill="#c4b5fd" fillOpacity="0.7"/>
          <circle cx="420" cy="150" r="22" fill="none" stroke="#6d28d9" strokeWidth="1.5"/>
          <polygon points="300,100 330,150 270,150" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
          <polygon points="50,220 70,260 30,260" fill="#ddd6fe" fillOpacity="0.9"/>
          <text x="10"  y="310" fontSize="42" fill="#6d28d9" fontFamily="Georgia,serif">&#945;</text>
          <text x="70"  y="300" fontSize="30" fill="#7c3aed" fontFamily="Georgia,serif">&#8800;</text>
          <text x="130" y="315" fontSize="38" fill="#4c1d95" fontFamily="Georgia,serif">2</text>
          <text x="260" y="310" fontSize="32" fill="#6d28d9" fontFamily="Georgia,serif">&#8721;</text>
          <text x="330" y="300" fontSize="28" fill="#7c3aed" fontFamily="Georgia,serif">&#960;</text>
          <text x="400" y="315" fontSize="40" fill="#4c1d95" fontFamily="Georgia,serif">&#8594;</text>
          <rect x="40"  y="350" width="40" height="40" rx="4" fill="none" stroke="#a5b4fc" strokeWidth="2"/>
          <circle cx="260" cy="375" r="18" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
          <polygon points="360,350 390,390 330,390" fill="none" stroke="#6d28d9" strokeWidth="1.5"/>
          <text x="20"  y="470" fontSize="34" fill="#7c3aed" fontFamily="Georgia,serif">f(x)</text>
          <text x="120" y="460" fontSize="26" fill="#4c1d95" fontFamily="Georgia,serif">&#247;</text>
          <text x="170" y="475" fontSize="36" fill="#6d28d9" fontFamily="Georgia,serif">&#215;</text>
          <text x="230" y="465" fontSize="28" fill="#7c3aed" fontFamily="Georgia,serif">&#8730;</text>
          <text x="290" y="475" fontSize="40" fill="#4c1d95" fontFamily="Georgia,serif">&#916;</text>
          <circle cx="380" cy="455" r="16" fill="none" stroke="#7c3aed" strokeWidth="2"/>
          <rect x="420" y="440" width="36" height="36" rx="4" fill="none" stroke="#a5b4fc" strokeWidth="1.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm)"/>
    </svg>
  )
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ stepNum, total, title, children }) {
  return (
    <div style={{
      background:C.cardBg, border:`0.5px solid ${C.cardBorder}`,
      borderRadius:'14px', borderLeft:`4px solid ${C.accent}`,
      padding:'26px 30px', marginBottom:'8px',
      boxShadow:'0 2px 12px rgba(124,58,237,0.06)', position:'relative', zIndex:1,
    }}>
      <div style={{
        display:'inline-block', padding:'4px 12px', borderRadius:'20px',
        background:C.pillBg, color:C.pillText,
        fontSize:F.pill, fontWeight:'600', letterSpacing:'0.05em',
        textTransform:'uppercase', marginBottom:'10px'
      }}>
        step {stepNum} of {total}
      </div>
      <h3 style={{ fontSize:F.stepTitle, fontWeight:'500', color:C.accentDark, marginBottom:'12px' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

// ─── Sidebar completed entry ──────────────────────────────────────────────────
function CompletedStepEntry({ title }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'8px',
      padding:'9px 12px', background:C.doneBg,
      borderRadius:'10px', marginBottom:'6px',
      border:`0.5px solid ${C.cardBorder}`, opacity:0.85, whiteSpace:'nowrap'
    }}>
      <div style={{
        width:'20px', height:'20px', borderRadius:'50%',
        background:C.successBg, border:`1.5px solid ${C.successBdr}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'10px', color:C.successText, flexShrink:0
      }}>&#10003;</div>
      <span style={{ fontSize:F.label, color:C.doneText, lineHeight:'1.3' }}>{title}</span>
    </div>
  )
}

// ─── Step tracker ─────────────────────────────────────────────────────────────
function StepTracker({ steps, currentStep }) {
  const labels = ['understand','operation','numbers','expression','equation']
  return (
    <div style={{ display:'flex', alignItems:'center', marginBottom:'22px', position:'relative', zIndex:1 }}>
      {steps.map((step, i) => {
        const isDone   = step.id < currentStep
        const isActive = step.id === currentStep
        return (
          <div key={step.id} style={{ display:'flex', alignItems:'center', flex: i < steps.length-1 ? 1 : 'none' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
              <div style={{
                width:'32px', height:'32px', borderRadius:'50%',
                border:`2px solid ${isDone ? C.successText : isActive ? C.accent : C.cardBorder}`,
                background: isDone ? C.successText : isActive ? C.accent : C.cardBg,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:F.trackerDot, color: isDone || isActive ? '#fff' : C.mutedText, flexShrink:0
              }}>
                {isDone ? '✓' : step.id}
              </div>
              <div style={{
                fontSize:F.trackerLbl,
                color: isDone ? C.successText : isActive ? C.accent : C.mutedText,
                fontWeight: isActive ? '600' : '400',
                textAlign:'center', maxWidth:'58px', lineHeight:'1.3'
              }}>{labels[i]}</div>
            </div>
            {i < steps.length-1 && (
              <div style={{ flex:1, height:'2px', marginBottom:'18px', background: isDone ? C.successText : C.cardBorder }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Flip card (Step 2) ───────────────────────────────────────────────────────
function FlipCard({ label, feedback, isCorrect, flipped, onFlip }) {
  return (
    <div onClick={onFlip} style={{ perspective:'700px', height:'110px', cursor:'pointer', width:'100%' }}>
      <div style={{
        position:'relative', width:'100%', height:'100%',
        transition:'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
        transformStyle:'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'none'
      }}>
        <div style={{
          position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
          borderRadius:'12px', border:`2px solid ${C.cardBorder}`, background:C.accentLight,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px'
        }}>
          <span style={{ fontSize:'17px', fontWeight:'500', color:C.accentDark }}>{label}</span>
          <span style={{ fontSize:'12px', color:C.mutedText }}>tap to reveal</span>
        </div>
        <div style={{
          position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
          borderRadius:'12px', transform:'rotateY(180deg)',
          background: isCorrect ? C.successBg : C.errorBg,
          border:`2px solid ${isCorrect ? C.successBdr : C.errorBdr}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'12px', textAlign:'center', fontSize:'14px', lineHeight:'1.5',
          color: isCorrect ? C.successText : C.errorText
        }}>
          {feedback}
        </div>
      </div>
    </div>
  )
}

// ─── Tile builder (Step 4) ────────────────────────────────────────────────────
const TILES = [
  { id:'x',     label:'x', type:'var' },
  { id:'plus',  label:'+', type:'op', correct:true },
  { id:'minus', label:'-', type:'op', correct:false, why:'Subtracting would make Asha younger, but she is older!' },
  { id:'times', label:'x', type:'op', correct:false, why:'Multiplying would make the gap grow, not stay at 4.' },
  { id:'div',   label:'/', type:'op', correct:false, why:'Division would shrink the number, not add years.' },
  { id:'4',     label:'4', type:'num' },
  { id:'2',     label:'2', type:'num' },
  { id:'8',     label:'8', type:'num' },
]

function TileBuilder({ placed, onPlace, onRemove, onClear, tooltip }) {
  const usedIds = placed.map(t => t.id)
  return (
    <div>
      <p style={{ fontSize:F.meta, color:C.mutedText, marginBottom:'12px', fontStyle:'italic' }}>
        Tap a tile to place it. Tap a placed tile to remove it.
      </p>
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'14px' }}>
        {TILES.map(t => {
          const used    = usedIds.includes(t.id)
          const wrongOp = t.type === 'op' && !t.correct
          return (
            <div key={t.id} onClick={() => onPlace(t)} style={{
              padding:'10px 22px', borderRadius:'10px', fontSize:F.tileLabel,
              fontFamily:'monospace', fontWeight:'600',
              cursor: used ? 'not-allowed' : 'pointer',
              border:`2px solid ${used ? (wrongOp ? C.errorBdr : C.cardBorder) : C.accent}`,
              background: used ? (wrongOp ? C.errorBg : C.accentLight) : C.cardBg,
              color: used ? (wrongOp ? C.errorText : C.mutedText) : C.accent,
              opacity: used ? (wrongOp ? 0.7 : 0.35) : 1,
              userSelect:'none', transition:'all 0.15s'
            }}>{t.label}</div>
          )
        })}
      </div>
      {tooltip && (
        <div style={{ padding:'10px 14px', background:C.errorBg, border:`0.5px solid ${C.errorBdr}`, borderRadius:'8px', fontSize:F.meta, color:C.errorText, marginBottom:'12px' }}>
          {tooltip}
        </div>
      )}
      <p style={{ fontSize:F.meta, color:C.mutedText, marginBottom:'8px' }}>your expression</p>
      <div style={{
        display:'flex', alignItems:'center', gap:'10px', padding:'14px 18px',
        border:`2px dashed ${placed.length > 0 ? C.accent : C.cardBorder}`,
        borderRadius:'10px', minHeight:'56px', flexWrap:'wrap',
        background: placed.length > 0 ? C.accentLight : C.pageBg, marginBottom:'12px'
      }}>
        {placed.length === 0
          ? <span style={{ fontSize:F.meta, color:C.mutedText, fontStyle:'italic' }}>tap tiles above to build your expression</span>
          : placed.map((t, i) => (
            <div key={i} onClick={() => onRemove(i)} title="tap to remove" style={{
              padding:'8px 18px', borderRadius:'8px', background:C.accent,
              color:'#fff', fontSize:F.tileLabel, fontFamily:'monospace', fontWeight:'600', cursor:'pointer'
            }}>{t.label}</div>
          ))
        }
      </div>
      <button onClick={onClear} style={{
        padding:'8px 16px', border:`0.5px solid ${C.cardBorder}`,
        borderRadius:'8px', background:'transparent', fontSize:F.meta,
        cursor:'pointer', color:C.mutedText, fontFamily:'inherit'
      }}>Clear</button>
    </div>
  )
}

// ─── Compact number line (Step 5) ─────────────────────────────────────────────
function NumberLinePattern({ rows }) {
  return (
    <div>
      <p style={{ fontSize:F.meta, color:C.mutedText, marginBottom:'12px', fontStyle:'italic' }}>
        Every time, the jump is always +4
      </p>
      {rows.map((row, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', marginBottom:'11px' }}>
          <div style={{
            width:'40px', height:'40px', borderRadius:'50%',
            background:C.accentLight, border:`2px solid ${C.accentMid}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:F.nlCircle, fontWeight:'500', color:C.accentDark, flexShrink:0
          }}>{row.input}</div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', minWidth:'50px' }}>
            <div style={{
              padding:'2px 10px', borderRadius:'20px', background:C.pillBg,
              fontSize:'12px', fontWeight:'600', color:C.pillText, marginBottom:'3px'
            }}>+4</div>
            <div style={{ width:'100%', height:'2px', background:C.accentMid }} />
          </div>
          <div style={{
            width:'40px', height:'40px', borderRadius:'50%',
            background: row.isX ? C.accentLight : C.successBg,
            border:`2px solid ${row.isX ? C.accent : C.successBdr}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'13px', fontWeight:'500',
            color: row.isX ? C.accent : C.successText, flexShrink:0
          }}>{row.output}</div>
          <div style={{
            marginLeft:'12px', fontSize:F.nlLabel,
            color: row.isX ? C.accent : C.mutedText,
            fontWeight: row.isX ? '500' : '400', whiteSpace:'nowrap'
          }}>{row.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Inline radio (Step 5 sub-questions) ─────────────────────────────────────
function InlineRadio({ prompt, options, selected, onSelect, feedback }) {
  return (
    <div style={{ marginBottom:'18px' }}>
      <p style={{ fontSize:F.body, color:C.promptText, lineHeight:'1.6', marginBottom:'10px' }}>{prompt}</p>
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'8px' }}>
        {options.map(opt => {
          const isSel = selected === opt
          return (
            <button key={opt} onClick={() => !feedback && onSelect(opt)} style={{
              padding:'9px 22px', borderRadius:'10px', fontSize:'16px', fontWeight:'500',
              cursor: feedback ? 'default' : 'pointer',
              border:`2px solid ${isSel ? C.accent : C.cardBorder}`,
              background: isSel ? C.accentLight : C.cardBg,
              color: isSel ? C.accentDark : C.mutedText,
              fontFamily:'inherit', transition:'all 0.15s'
            }}>{opt}</button>
          )
        })}
      </div>
      {feedback && (
        <p style={{
          fontSize:'15px', padding:'9px 12px', borderRadius:'8px', margin:0,
          color: feedback.type === 'success' ? C.successText : C.errorText,
          background: feedback.type === 'success' ? C.successBg : C.errorBg,
        }}>{feedback.message}</p>
      )}
    </div>
  )
}

// ─── Shared button style ──────────────────────────────────────────────────────
const btnStyle = {
  padding:'11px 26px', background:C.btnBg, color:C.btnText,
  border:'none', borderRadius:'10px', fontSize:'16px',
  fontWeight:'500', cursor:'pointer', fontFamily:'inherit'
}

// ─── Main component ───────────────────────────────────────────────────────────
function TaskTab({ steps, problem, progress, onUpdateProgress, onTableComplete }) {
  const [answers, setAnswers]                   = useState({})
  const [feedback, setFeedback]                 = useState({})
  const [confirmationStep, setConfirmationStep] = useState(null)
  const [flippedCards, setFlippedCards]         = useState({})
  const [step2Unlocked, setStep2Unlocked]       = useState(false)
  const [placedTiles, setPlacedTiles]           = useState([])
  const [tileFeedback, setTileFeedback]         = useState(null)
  const [tileTooltip, setTileTooltip]           = useState(null)
  const [step4Unlocked, setStep4Unlocked]       = useState(false)

  const [q5aAnswer, setQ5aAnswer]           = useState(null)
  const [q5aFeedback, setQ5aFeedback]       = useState(null)
  const [q5bAnswer, setQ5bAnswer]           = useState(null)
  const [q5bFeedback, setQ5bFeedback]       = useState(null)
  const [q5cAnswer, setQ5cAnswer]           = useState('')
  const [q5cFeedback, setQ5cFeedback]       = useState(null)
  const [q5cLoading, setQ5cLoading]         = useState(false)
  const [showConclusion, setShowConclusion] = useState(false)

  function getCurrentStep() {
    for (let i = steps.length; i >= 1; i--) {
      if ((progress[steps[i-1].id] || {}).completed) return i < steps.length ? i+1 : i
    }
    return 1
  }

  const currentStep    = getCurrentStep()
  const completed      = steps.every(s => (progress[s.id] || {}).completed)
  const completedSteps = steps.filter(s => s.id < currentStep)
  const activeStep     = steps.find(s => s.id === currentStep)

  function handleFlip(cardId, isCorrect) {
    setFlippedCards(prev => ({ ...prev, [cardId]: true }))
    if (isCorrect) setTimeout(() => setStep2Unlocked(true), 500)
  }
  async function handleStep2Confirm() {
    const step = steps.find(s => s.id === 2)
    const sp   = progress[step.id] || { attempts:0, hintsUnlocked:0, completed:false }
    onUpdateProgress(step.id, { ...sp, attempts:1, completed:true })
  }

  function handlePlaceTile(tile) {
    if (placedTiles.map(t => t.id).includes(tile.id)) return
    if (tile.type === 'op' && !tile.correct) {
      setTileTooltip(tile.why)
      setTimeout(() => setTileTooltip(null), 3000)
    }
    setPlacedTiles(prev => [...prev, tile])
    setTileFeedback(null)
  }
  function handleRemoveTile(index) {
    setPlacedTiles(prev => prev.filter((_, i) => i !== index))
    setTileFeedback(null); setTileTooltip(null)
  }
  function handleClearTiles() {
    setPlacedTiles([]); setTileFeedback(null); setTileTooltip(null); setStep4Unlocked(false)
  }
  function checkTileExpression() {
    const step = steps.find(s => s.id === 4)
    const sp   = progress[step.id] || { attempts:0, hintsUnlocked:0, completed:false }
    const expr = placedTiles.map(t => t.label).join(' ')
    if (expr === 'x + 4') {
      setTileFeedback({ type:'success', message:step.validation.successMessage })
      setStep4Unlocked(true)
      onUpdateProgress(step.id, { ...sp, attempts:1, completed:true })
      setConfirmationStep(step.id)
    } else if (placedTiles.length === 0) {
      setTileFeedback({ type:'error', message:'Place some tiles first.' })
    } else {
      onUpdateProgress(step.id, { ...sp, attempts:sp.attempts+1, completed:false })
      setTileFeedback({ type:'error', message:step.validation.hintMessage || "Not quite. Think back to Step 3. You added 4 to get Asha's age. How do you write that using x?" })
    }
  }

  function handleQ5a(answer) {
    setQ5aAnswer(answer)
    const q = steps.find(s => s.id === 5).questions[0]
    setQ5aFeedback(answer === q.validation.answer
      ? { type:'success', message:q.validation.successMessage }
      : { type:'error',   message:q.validation.hintMessage })
  }
  function handleQ5b(answer) {
    setQ5bAnswer(answer)
    const q = steps.find(s => s.id === 5).questions[1]
    setQ5bFeedback(answer === q.validation.answer
      ? { type:'success', message:q.validation.successMessage }
      : { type:'error',   message:q.validation.hintMessage })
  }
  async function handleQ5c() {
    const q = steps.find(s => s.id === 5).questions[2]
    setQ5cLoading(true)
    const result = await validateAI({ ...q, attemptCount:0 }, q5cAnswer)
    setQ5cLoading(false)
    if (result.isCorrect) {
      setQ5cFeedback({ type:'success', message:q.validation.successMessage })
      setTimeout(() => setShowConclusion(true), 600)
    } else {
      setQ5cFeedback({ type:'error', message:result.message || q.validation.hintMessage })
    }
  }
  function handleStep5Complete() {
    const step = steps.find(s => s.id === 5)
    onUpdateProgress(step.id, { ...(progress[step.id] || {}), completed:true, hintsUnlocked:0, attempts:1 })
    if (onTableComplete) onTableComplete([])
  }

  function handleAnswerChange(stepId, value) {
    setAnswers(prev => ({ ...prev, [stepId]:value }))
  }
  async function checkAnswer(step) {
    const userAnswer     = answers[step.id]
    const { validation } = step
    const sp             = progress[step.id] || { attempts:0, hintsUnlocked:0, completed:false }
    if (step.id === 1) {
      const result = validateStep1(userAnswer)
      onUpdateProgress(step.id, { ...sp, attempts:sp.attempts+1, completed:result.isCorrect })
      setFeedback(prev => ({ ...prev, [step.id]:{ type:result.isCorrect ? 'success' : 'error', message:result.message } }))
      return
    }
    let result
    if (validation.type === 'open-ended' || validation.type === 'expression') {
      setFeedback(prev => ({ ...prev, [step.id]:{ type:'loading', message:'Checking your answer...' } }))
      result = await validateAI({ ...step, attemptCount:sp.attempts }, userAnswer)
    } else {
      result = validateLocal(step, userAnswer)
    }
    if (result.isCorrect) {
      onUpdateProgress(step.id, { ...sp, attempts:sp.attempts+1, completed:true })
      setFeedback(prev => ({ ...prev, [step.id]:{ type:'success', message:result.message } }))
    } else {
      const newAttempts   = sp.attempts+1
      const hintsUnlocked = newAttempts >= 2 && validation.hints?.length
        ? Math.min((sp.hintsUnlocked||0)+1, validation.hints.length)
        : sp.hintsUnlocked||0
      onUpdateProgress(step.id, { ...sp, attempts:newAttempts, completed:false, hintsUnlocked })
      setFeedback(prev => ({ ...prev, [step.id]:{ type:'error', message:result.message } }))
    }
  }
  function renderHints(step) {
    const sp = progress[step.id] || { hintsUnlocked:0, attempts:0 }
    const n  = sp.hintsUnlocked||0
    if (!step.validation.hints || n === 0) return null
    return (
      <div className="hint-container" style={{ marginTop:'12px' }}>
        {step.validation.hints.slice(0,n).map((hint,i) => (
          <div key={i} className="hint-item">
            <span className="hint-number">Hint {i+1}:</span>
            <span className="hint-text" style={{ fontSize:F.body }}>{hint}</span>
          </div>
        ))}
        {sp.attempts >= 2 && n < step.validation.hints.length && (
          <button className="hint-button" style={{ fontSize:F.meta }} onClick={() => {
            const cur = progress[step.id] || { hintsUnlocked:0, attempts:0 }
            onUpdateProgress(step.id, { ...cur, hintsUnlocked:Math.min((cur.hintsUnlocked||0)+1, step.validation.hints.length) })
          }}>Need another hint?</button>
        )}
      </div>
    )
  }

  const NL_ROWS = [
    { input:'10', output:'14',  label:'Priya 10, Asha 14' },
    { input:'14', output:'18',  label:'Priya 14, Asha 18' },
    { input:'5',  output:'9',   label:'Priya 5, Asha 9' },
    { input:'20', output:'24',  label:'Priya 20, Asha 24' },
    { input:'x',  output:'x+4', label:'Priya x, Asha x+4', isX:true },
  ]
  const FLIP_OPTIONS = [
    { id:'add', label:'Addition',       isCorrect:true,  feedback:'Yes! "Older by" means we add. Asha = Priya + 4.' },
    { id:'sub', label:'Subtraction',    isCorrect:false, feedback:'Not quite. Subtracting would make Asha younger, not older.' },
    { id:'mul', label:'Multiplication', isCorrect:false, feedback:'Not quite. Multiplying makes the gap grow, not stay at 4.' },
    { id:'div', label:'Division',       isCorrect:false, feedback:'Not quite. Division would shrink the number, not add years.' },
  ]

  function renderStepContent(step) {
    const sp = progress[step.id] || {}

    // ── Step 5 ──────────────────────────────────────────────────────────────
    if (step.type === 'table-bridge') {
      const q5a  = step.questions[0]
      const q5b  = step.questions[1]
      const q5c  = step.questions[2]
      const q5aOk = q5aFeedback?.type === 'success'
      const q5bOk = q5bFeedback?.type === 'success'
      const q5cOk = q5cFeedback?.type === 'success'
      return (
        <StepCard stepNum={step.id} total={steps.length} title={step.title}>
          <p style={{ fontSize:F.body, color:C.mutedText, marginBottom:'16px' }}>
            You found that Asha's age = x + 4. Let's check if this holds for every age.
          </p>
          <div style={{ display:'flex', gap:'28px', alignItems:'flex-start', flexWrap:'wrap' }}>
            <div style={{
              flex:'0 0 auto', minWidth:'240px',
              background:C.accentLight, borderRadius:'12px',
              padding:'16px 18px', border:`0.5px solid ${C.cardBorder}`
            }}>
              <NumberLinePattern rows={NL_ROWS} />
            </div>
            <div style={{ flex:'1', minWidth:'220px' }}>
              <InlineRadio prompt={q5a.prompt} options={q5a.options} selected={q5aAnswer} onSelect={handleQ5a} feedback={q5aFeedback} />
              {q5aOk && (
                <InlineRadio prompt={q5b.prompt} options={q5b.options} selected={q5bAnswer} onSelect={handleQ5b} feedback={q5bFeedback} />
              )}
              {q5aOk && q5bOk && !q5cOk && (
                <div>
                  <p style={{ fontSize:F.body, color:C.promptText, lineHeight:'1.6', marginBottom:'10px' }}>{q5c.prompt}</p>
                  <textarea rows={3} placeholder={q5c.placeholder} value={q5cAnswer}
                    onChange={e => setQ5cAnswer(e.target.value)}
                    className="task-textarea"
                    style={{ fontSize:F.input, background:C.accentLight, border:`1px solid ${C.cardBorder}` }}
                  />
                  {q5cFeedback && (
                    <p style={{
                      fontSize:'15px', padding:'9px 12px', borderRadius:'8px', marginTop:'8px',
                      color: q5cFeedback.type === 'success' ? C.successText : C.errorText,
                      background: q5cFeedback.type === 'success' ? C.successBg : C.errorBg,
                    }}>{q5cFeedback.message}</p>
                  )}
                  <button onClick={handleQ5c} disabled={q5cLoading || !q5cAnswer.trim()}
                    style={{ ...btnStyle, marginTop:'10px', opacity: q5cLoading || !q5cAnswer.trim() ? 0.6 : 1 }}>
                    {q5cLoading ? 'Checking...' : 'Check Answer'}
                  </button>
                </div>
              )}
              {(q5cOk || showConclusion) && (
                <>
                  <div style={{
                    background:C.successBg, border:`0.5px solid ${C.successBdr}`,
                    borderRadius:'12px', padding:'16px 20px', marginTop:'14px', marginBottom:'14px'
                  }}>
                    <p style={{ fontSize:F.body, color:C.successText, marginBottom:'8px' }}>{step.conclusion.message}</p>
                    <div style={{ fontSize:F.conclusion, fontWeight:'500', color:'#047857', fontFamily:'monospace', marginBottom:'8px' }}>
                      {step.conclusion.equation}
                    </div>
                    <p style={{ fontSize:F.meta, color:C.successText, margin:0 }}>{step.conclusion.nextStep}</p>
                  </div>
                  {!sp.completed && (
                    <button onClick={handleStep5Complete} style={btnStyle}>Continue to Graph</button>
                  )}
                </>
              )}
            </div>
          </div>
        </StepCard>
      )
    }

    // ── Step 2 ──────────────────────────────────────────────────────────────
    if (step.type === 'radio' && step.id === 2) {
      return (
        <StepCard stepNum={step.id} total={steps.length} title={step.title}>
          <p style={{ fontSize:F.body, color:C.promptText, lineHeight:'1.6', marginBottom:'8px' }}>{step.prompt}</p>
          <p style={{ fontSize:F.meta, color:C.mutedText, marginBottom:'16px', fontStyle:'italic' }}>Tap each card to reveal the answer.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'18px' }}>
            {FLIP_OPTIONS.map(opt => (
              <FlipCard key={opt.id} label={opt.label} feedback={opt.feedback}
                isCorrect={opt.isCorrect} flipped={!!flippedCards[opt.id]}
                onFlip={() => handleFlip(opt.id, opt.isCorrect)} />
            ))}
          </div>
          {step2Unlocked && !sp.completed && (
            <button onClick={handleStep2Confirm} style={btnStyle}>Continue</button>
          )}
          {sp.completed && (
            <p style={{ fontSize:F.body, color:C.successText, marginTop:'8px' }}>{step.validation.successMessage}</p>
          )}
        </StepCard>
      )
    }

    // ── Step 4 ──────────────────────────────────────────────────────────────
    if (step.type === 'expression-builder') {
      return (
        <StepCard stepNum={step.id} total={steps.length} title={step.title}>
          <p style={{ fontSize:F.body, color:C.promptText, lineHeight:'1.6', marginBottom:'16px' }}>
            Priya's age could be anything, not just 10. Use the tiles to build an expression for Asha's age using x.
          </p>
          <TileBuilder placed={placedTiles} onPlace={handlePlaceTile}
            onRemove={handleRemoveTile} onClear={handleClearTiles} tooltip={tileTooltip} />
          {tileFeedback && (
            <p style={{
              fontSize:F.body, padding:'10px 14px', borderRadius:'8px', marginTop:'12px',
              color: tileFeedback.type === 'success' ? C.successText : C.errorText,
              background: tileFeedback.type === 'success' ? C.successBg : C.errorBg,
            }}>{tileFeedback.message}</p>
          )}
          {!sp.completed && (
            <button onClick={checkTileExpression} style={{ ...btnStyle, marginTop:'14px' }}>Check expression</button>
          )}
          {confirmationStep === step.id && step.validation.confirmationBox && (
            <div style={{ marginTop:'14px', background:C.successBg, border:`0.5px solid ${C.successBdr}`, borderRadius:'10px', padding:'16px 20px' }}>
              <p style={{ fontSize:'20px', fontWeight:'500', color:'#047857', fontFamily:'monospace', marginBottom:'6px' }}>
                {step.validation.confirmationBox.expression}
              </p>
              <p style={{ fontSize:F.body, color:C.successText, marginBottom:'12px' }}>
                {step.validation.confirmationBox.message}
              </p>
              <button onClick={() => setConfirmationStep(null)} style={{ padding:'9px 20px', background:'#059669', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', fontFamily:'inherit' }}>
                {step.validation.confirmationBox.buttonLabel}
              </button>
            </div>
          )}
        </StepCard>
      )
    }

    // ── Steps 1 and 3 ────────────────────────────────────────────────────────
    return (
      <StepCard stepNum={step.id} total={steps.length} title={step.title}>
        <p style={{ fontSize:F.body, color:C.promptText, lineHeight:'1.6', marginBottom:'16px' }}>
          {step.id === 1 ? 'What does "older" mean to you?' : step.prompt}
        </p>
        {step.type === 'textarea' && (
          <textarea className="task-textarea"
            placeholder={step.id === 1 ? 'e.g. bigger, more, greater...' : step.placeholder}
            rows={3} value={answers[step.id]||''}
            onChange={e => handleAnswerChange(step.id, e.target.value)}
            style={{ fontSize:F.input, background:C.accentLight, border:`1px solid ${C.cardBorder}` }}
          />
        )}
        {step.type === 'number' && (
          <input type="number" className="task-input"
            placeholder={step.placeholder} value={answers[step.id]||''}
            onChange={e => handleAnswerChange(step.id, e.target.value)}
            style={{ fontSize:F.numberInput, padding:'12px 16px', border:`1.5px solid ${C.cardBorder}`, borderRadius:'10px', background:C.accentLight, color:C.accentDark, width:'160px' }}
          />
        )}
        {feedback[step.id] && (
          <p style={{
            fontSize:F.body, marginTop:'12px', padding:'12px 16px', borderRadius:'10px',
            color: feedback[step.id].type === 'success' ? C.successText : feedback[step.id].type === 'loading' ? C.mutedText : C.errorText,
            background: feedback[step.id].type === 'success' ? C.successBg : feedback[step.id].type === 'loading' ? C.accentLight : C.errorBg,
          }}>{feedback[step.id].message}</p>
        )}
        {renderHints(step)}
        {!sp.completed && (
          <button onClick={() => checkAnswer(step)} style={{ ...btnStyle, marginTop:'16px' }}>Check Answer</button>
        )}
      </StepCard>
    )
  }

  // ── Shared header ─────────────────────────────────────────────────────────────
  const SharedHeader = (
    <div style={{ position:'relative', zIndex:1 }}>
      <div style={{ background:'#1e1b4b', borderRadius:'10px', padding:'14px 20px', marginBottom:'18px', display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#818cf8', flexShrink:0 }} />
        <p style={{ fontSize:F.objective, color:'#e0e7ff', margin:0 }}>
          <span style={{ fontWeight:'500', color:'#a5b4fc' }}>Objective: </span>
          I can translate a word problem into an algebraic expression using a variable.
        </p>
      </div>
      <div style={{ background:C.accentLight, border:`0.5px solid ${C.cardBorder}`, borderRadius:'12px', padding:'16px 22px', marginBottom:'22px' }}>
        <div style={{ fontSize:'11px', fontWeight:'600', color:C.accentDark, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'6px' }}>the problem</div>
        <div style={{ fontSize:F.problem, color:'#1e1b4b', lineHeight:'1.6', marginBottom:'6px' }}>{problem.statement}</div>
        <div style={{ fontSize:F.problem, color:C.accent, fontWeight:'500' }}>{problem.question}</div>
      </div>
    </div>
  )

  // ── Sidebar ───────────────────────────────────────────────────────────────────
  const Sidebar = completedSteps.length > 0 ? (
    <div style={{
      flexShrink:0, flexGrow:0,
      background:'rgba(255,255,255,0.85)',
      borderRadius:'12px', padding:'14px',
      border:`0.5px solid ${C.cardBorder}`,
      position:'relative', zIndex:1, alignSelf:'flex-start',
    }}>
      <div style={{ fontSize:'11px', fontWeight:'600', color:C.accentDark, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'10px' }}>
        completed
      </div>
      {completedSteps.map(s => <CompletedStepEntry key={s.id} title={s.title} />)}
    </div>
  ) : null

  // ── Completed view ────────────────────────────────────────────────────────────
  if (completed) {
    return (
      <div className="panel" role="tabpanel" id="panel-task"
        style={{ background:C.pageBg, position:'relative', minHeight:'100%' }}>
        <WatermarkLayer />
        <div className="task-container" style={{ position:'relative', zIndex:1 }}>
          {SharedHeader}
          <div style={{ display:'flex', gap:'24px', alignItems:'flex-start', flexWrap:'wrap' }}>
            <div style={{ flexShrink:0, background:'rgba(255,255,255,0.85)', borderRadius:'12px', padding:'14px', border:`0.5px solid ${C.cardBorder}` }}>
              <div style={{ fontSize:'11px', fontWeight:'600', color:C.accentDark, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'10px' }}>all steps</div>
              {steps.map(s => <CompletedStepEntry key={s.id} title={s.title} />)}
            </div>
            <div style={{ flex:1, minWidth:'280px' }}>
              <div style={{ background:C.successBg, border:`0.5px solid ${C.successBdr}`, borderRadius:'14px', padding:'26px 30px' }}>
                <div style={{ fontSize:'12px', color:C.successText, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'10px' }}>what you discovered</div>
                <div style={{ fontSize:'28px', fontWeight:'500', color:'#047857', fontFamily:'monospace', marginBottom:'10px' }}>y = x + 4</div>
                <p style={{ fontSize:F.body, color:C.successText, margin:0 }}>
                  You turned a word problem into an equation. Now let's see what it looks like as a graph.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Active view ───────────────────────────────────────────────────────────────
  return (
    <div className="panel" role="tabpanel" id="panel-task"
      style={{ background:C.pageBg, position:'relative', minHeight:'100%' }}>
      <WatermarkLayer />
      <div className="task-container" style={{ position:'relative', zIndex:1 }}>
        {SharedHeader}
        <StepTracker steps={steps} currentStep={currentStep} />
        <div style={{ display:'flex', gap:'24px', alignItems:'flex-start' }}>
          {Sidebar}
          <div style={{ flex:1, minWidth:0, position:'relative', zIndex:1 }}>
            {activeStep && renderStepContent(activeStep)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskTab
