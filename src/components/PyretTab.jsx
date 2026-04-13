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
  errorBg:     '#fee2e2',
  errorBdr:    '#fca5a5',
  doneBg:      '#ede9fe',
  doneText:    '#5b21b6',
  codeBg:      '#1e1e2e',
}

const F = {
  pill:    '11px',
  meta:    '14px',
  body:    '17px',
  heading: '20px',
  code:    '15px',
}

const btnStyle = {
  padding: '10px 22px', background: C.accent, color: '#fff',
  border: 'none', borderRadius: '10px', fontSize: '15px',
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
        <pattern id="wm-pyret" x="0" y="0" width="520" height="520" patternUnits="userSpaceOnUse">
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
      <rect width="100%" height="100%" fill="url(#wm-pyret)"/>
    </svg>
  )
}

// ─── Feedback ─────────────────────────────────────────────────────────────────
function Msg({ type, children }) {
  const ok = type === 'success'
  return (
    <p style={{
      fontSize: F.body, padding: '10px 14px', borderRadius: '10px', marginTop: '10px',
      color: ok ? C.successText : '#92400e',
      background: ok ? C.successBg : '#fef3c7',
      border: `0.5px solid ${ok ? C.successBdr : '#f59e0b'}`,
      margin: '10px 0 0 0',
    }}>{children}</p>
  )
}

// ─── Live code panel ──────────────────────────────────────────────────────────
// Shows the function definition with both inputs updating live in line 2.
// The function call below has two inline editable inputs.
function LiveCodePanel({ ageVal, setAgeVal, yearsVal, setYearsVal, onRun, lastResult, runCount }) {
  const ageDisplay   = ageVal   !== '' ? ageVal   : 'age'
  const yearsDisplay = yearsVal !== '' ? yearsVal : 'years-older'
  const canRun       = ageVal !== '' && yearsVal !== ''
  const hasResult    = lastResult !== null

  const inlineInput = (value, setValue, placeholder, width) => (
    <input
      type="number"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && canRun && onRun()}
      placeholder={placeholder}
      style={{
        width,
        background: 'rgba(255,255,255,0.08)',
        border: `2px solid ${value !== '' ? '#22c55e' : '#6366f1'}`,
        borderRadius: '6px',
        color: value !== '' ? '#22c55e' : '#818cf8',
        fontFamily: 'monospace', fontSize: F.code,
        padding: '3px 8px', outline: 'none', textAlign: 'center',
        transition: 'border-color 0.2s, color 0.2s',
      }}
    />
  )

  return (
    <div style={{
      background: C.codeBg, borderRadius: '12px', padding: '22px',
      fontFamily: 'monospace', fontSize: F.code, lineHeight: '2.8',
      border: `2px solid ${C.accent}`,
      boxShadow: '0 4px 20px rgba(124,58,237,0.2)',
    }}>
      {/* ── Function definition -- line 2 updates live ── */}
      <div style={{
        borderBottom: '1px solid #2d2d44',
        paddingBottom: '14px', marginBottom: '14px'
      }}>
        {/* Line 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#4b5563', fontSize: '11px', minWidth: '18px', textAlign: 'right', userSelect: 'none' }}>1</span>
          <span style={{ color: '#c084fc' }}>fun </span>
          <span style={{ color: '#f8f8f2' }}>find-sibling-age(age, years-older):</span>
          <span style={{ fontSize: '11px', color: '#4b5563', fontStyle: 'italic', fontFamily: 'sans-serif' }}>rule definition</span>
        </div>
        {/* Line 2 -- live update */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '28px' }}>
          <span style={{ color: '#4b5563', fontSize: '11px', minWidth: '18px', textAlign: 'right', userSelect: 'none' }}>2</span>
          <span style={{
            color: ageVal !== '' ? '#22c55e' : '#818cf8',
            background: ageVal !== '' ? 'rgba(34,197,94,0.1)' : 'rgba(129,140,248,0.1)',
            padding: '1px 6px', borderRadius: '4px', marginLeft: '8px',
            transition: 'all 0.2s', minWidth: '40px', textAlign: 'center', display: 'inline-block'
          }}>{ageDisplay}</span>
          <span style={{ color: '#f8f8f2' }}> + </span>
          <span style={{
            color: yearsVal !== '' ? '#22c55e' : '#818cf8',
            background: yearsVal !== '' ? 'rgba(34,197,94,0.1)' : 'rgba(129,140,248,0.1)',
            padding: '1px 6px', borderRadius: '4px',
            transition: 'all 0.2s', minWidth: '60px', textAlign: 'center', display: 'inline-block'
          }}>{yearsDisplay}</span>
          <span style={{ fontSize: '11px', color: '#4b5563', fontStyle: 'italic', fontFamily: 'sans-serif', marginLeft: '8px' }}>the rule</span>
        </div>
        {/* Line 3 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#4b5563', fontSize: '11px', minWidth: '18px', textAlign: 'right', userSelect: 'none' }}>3</span>
          <span style={{ color: '#c084fc' }}>end</span>
        </div>
      </div>

      {/* ── Function call ── */}
      <div style={{ marginBottom: '6px', fontSize: '11px', color: '#6b7280', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
        call the function -- type both values, then press Run:
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        <span style={{ color: '#c084fc' }}>find-sibling-age(</span>
        {inlineInput(ageVal, setAgeVal, 'age', '72px')}
        <span style={{ color: '#f8f8f2' }}>,</span>
        {inlineInput(yearsVal, setYearsVal, 'older by', '88px')}
        <span style={{ color: '#c084fc' }}>)</span>
        <button
          onClick={onRun}
          disabled={!canRun}
          style={{
            marginLeft: '10px', padding: '5px 18px',
            background: canRun ? '#22c55e' : '#374151',
            color: '#fff', border: 'none', borderRadius: '6px',
            fontSize: '13px', fontWeight: '600',
            cursor: canRun ? 'pointer' : 'not-allowed',
            fontFamily: 'sans-serif', transition: 'background 0.2s',
          }}
        >
          Run &#9654;
        </button>
      </div>

      {/* Labels under inputs */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '2px', paddingLeft: '164px' }}>
        <span style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'sans-serif', width: '72px', textAlign: 'center' }}>age</span>
        <span style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'sans-serif', width: '88px', textAlign: 'center', marginLeft: '8px' }}>years older</span>
      </div>

      {/* Output */}
      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#6b7280', fontSize: '11px', fontFamily: 'sans-serif' }}>output:</span>
        <span style={{
          color: hasResult ? '#22c55e' : '#4b5563',
          fontSize: F.code, fontWeight: hasResult ? '600' : '400',
          transition: 'color 0.3s',
        }}>
          {hasResult ? lastResult : '--'}
        </span>
        {hasResult && (
          <span style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
            find-sibling-age({ageVal}, {yearsVal}) = {lastResult}
          </span>
        )}
      </div>

      {/* Run count nudge */}
      {runCount > 0 && runCount < 3 && (
        <p style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'sans-serif', marginTop: '10px', fontStyle: 'italic' }}>
          Try a different age or a different gap. See what changes in the table.
        </p>
      )}
    </div>
  )
}

// ─── Output table ─────────────────────────────────────────────────────────────
// First row is Priya/Asha pre-filled. New rows append as student runs the code.
function OutputTable({ rows, lastIdx }) {
  // Pre-filled anchor row
  const anchorRow = { person: 'Priya', age: 9, yearsOlder: 4, sibling: 13, siblingName: 'Asha', isAnchor: true }
  const allRows   = [anchorRow, ...rows]

  return (
    <div style={{
      background: C.cardBg, border: `3px solid ${C.accent}`,
      borderRadius: '14px', padding: '18px',
      boxShadow: '0 4px 20px rgba(124,58,237,0.18)',
      position: 'sticky', top: '20px',
    }}>
      <div style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
        background: C.pillBg, color: C.pillText,
        fontSize: F.pill, fontWeight: '600', letterSpacing: '0.05em',
        textTransform: 'uppercase', marginBottom: '8px'
      }}>output table</div>

      <h3 style={{ fontSize: '16px', fontWeight: '500', color: C.accentDark, marginBottom: '4px', marginTop: 0 }}>
        find-sibling-age(age, years-older)
      </h3>
      <p style={{ fontSize: F.meta, color: C.mutedText, marginBottom: '14px' }}>
        Each time you press Run, a new row appears here.
      </p>

      <div style={{
        borderRadius: '8px', border: `0.5px solid ${C.cardBorder}`,
        maxHeight: '500px', overflowY: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr style={{ background: C.accent }}>
              <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: F.meta, fontWeight: '600', color: '#fff' }}>Age</th>
              <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: F.meta, fontWeight: '600', color: '#fff' }}>Years older</th>
              <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: F.meta, fontWeight: '600', color: '#fff' }}>Sibling's age</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, i) => {
              const isAnchor = row.isAnchor
              const isLatest = !isAnchor && i === lastIdx + 1 // offset by anchor row
              return (
                <tr key={i} style={{
                  background: isAnchor
                    ? C.successBg
                    : isLatest
                      ? C.accentLight
                      : i % 2 === 0 ? C.cardBg : '#f3f0ff',
                  outline: isLatest ? `2px solid ${C.accent}` : 'none',
                  transition: 'background 0.3s',
                }}>
                  <td style={{ padding: '9px 10px', fontSize: F.body, color: C.accentDark, fontFamily: 'monospace', fontWeight: isAnchor ? '600' : '400' }}>
                    {row.age}
                    {isAnchor && (
                      <span style={{ fontSize: '11px', color: C.successText, fontFamily: 'sans-serif', marginLeft: '6px', fontWeight: '400' }}>
                        (Priya)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '9px 10px', fontSize: F.body, color: C.accentDark, fontFamily: 'monospace' }}>
                    {row.yearsOlder}
                  </td>
                  <td style={{ padding: '9px 10px', fontSize: F.body, color: C.successText, fontFamily: 'monospace', fontWeight: '600' }}>
                    {row.sibling}
                    {isAnchor && (
                      <span style={{ fontSize: '11px', color: C.successText, fontFamily: 'sans-serif', marginLeft: '6px', fontWeight: '400' }}>
                        (Asha)
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '12px', color: C.mutedText, marginTop: '8px', textAlign: 'center' }}>
        {rows.length} {rows.length === 1 ? 'row' : 'rows'} added
        {rows.length >= 5 && (
          <span style={{ color: C.successText, fontWeight: '500' }}> -- the rule works for all of them!</span>
        )}
      </p>
    </div>
  )
}

// ─── Main PyretTab ────────────────────────────────────────────────────────────
function PyretTab({ pyret, onUpdateProgress }) {
  const [ageVal, setAgeVal]         = useState('')
  const [yearsVal, setYearsVal]     = useState('')
  const [tableRows, setTableRows]   = useState([])
  const [lastIdx, setLastIdx]       = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [runCount, setRunCount]     = useState(0)
  const [runFeedback, setRunFeedback] = useState(null)

  function handleRun() {
    const age   = parseFloat(ageVal)
    const years = parseFloat(yearsVal)
    if (isNaN(age) || isNaN(years) || years <= 0) {
      setRunFeedback({ type: 'hint', message: 'Make sure both values are filled in and years-older is greater than 0.' })
      return
    }
    const sibling = age + years
    setLastResult(sibling)
    setRunFeedback(null)
    setTableRows(prev => {
      const newIdx = prev.length
      setLastIdx(newIdx)
      return [...prev, { age, yearsOlder: years, sibling }]
    })
    setRunCount(c => c + 1)
  }

  return (
    <div className="panel" role="tabpanel" id="panel-pyret"
      style={{ background: C.pageBg, position: 'relative', minHeight: '100%' }}>
      <WatermarkLayer />
      <div className="task-container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Objective */}
        <div style={{
          background: '#1e1b4b', borderRadius: '10px', padding: '14px 20px',
          marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
          <p style={{ fontSize: '15px', color: '#e0e7ff', margin: 0 }}>
            <span style={{ fontWeight: '500', color: '#a5b4fc' }}>Objective: </span>
            I can use a Pyret function to find any sibling's age by changing the inputs.
          </p>
        </div>

        {/* Context card -- connects back to the story */}
        <div style={{
          background: C.accentLight, border: `0.5px solid ${C.cardBorder}`,
          borderRadius: '12px', padding: '16px 22px', marginBottom: '22px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: C.accentDark, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            the rule you found
          </div>
          <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', marginBottom: '6px' }}>
            In the Task tab you found that Asha's age = Priya's age + 4. In the graph you saw this works for any age.
          </p>
          <p style={{ fontSize: F.body, color: C.promptText, lineHeight: '1.6', margin: 0 }}>
            Below is that same rule written as a Pyret function. The first row of the table is already filled with Priya and Asha.
            Type any age and any gap into the function call and press Run -- that result fills the next row.
          </p>
        </div>

        {/* Side-by-side: code LEFT, table RIGHT */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* LEFT: code panel */}
          <div style={{ flex: 1, minWidth: '340px', zIndex: 1 }}>
            <div style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
              background: C.pillBg, color: C.pillText,
              fontSize: F.pill, fontWeight: '600', letterSpacing: '0.05em',
              textTransform: 'uppercase', marginBottom: '10px'
            }}>the code</div>

            <LiveCodePanel
              ageVal={ageVal}     setAgeVal={setAgeVal}
              yearsVal={yearsVal} setYearsVal={setYearsVal}
              onRun={handleRun}
              lastResult={lastResult}
              runCount={runCount}
            />

            {runFeedback && <Msg type={runFeedback.type}>{runFeedback.message}</Msg>}

            {/* Prompts that appear as student runs more */}
            {runCount === 0 && (
              <div style={{ marginTop: '16px', padding: '14px 18px', background: C.accentLight, borderRadius: '10px', border: `0.5px solid ${C.cardBorder}` }}>
                <p style={{ fontSize: F.body, color: C.accentDark, margin: 0 }}>
                  Try Priya's age (9) with a gap of 4. That is the Priya and Asha case. Then try a different age and a different gap.
                </p>
              </div>
            )}

            {runCount >= 3 && (
              <div style={{ marginTop: '16px', padding: '14px 18px', background: C.successBg, borderRadius: '10px', border: `0.5px solid ${C.successBdr}` }}>
                <p style={{ fontSize: F.body, color: C.successText, marginBottom: '6px', fontWeight: '500' }}>
                  Notice something?
                </p>
                <p style={{ fontSize: F.body, color: C.successText, margin: 0 }}>
                  The rule on line 2 never changed. You only changed the inputs. One function, any result.
                  That is the power of a function in code.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: output table */}
          <div style={{ flexShrink: 0, width: '340px', zIndex: 1 }}>
            <div style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
              background: C.pillBg, color: C.pillText,
              fontSize: F.pill, fontWeight: '600', letterSpacing: '0.05em',
              textTransform: 'uppercase', marginBottom: '10px'
            }}>output table</div>

            <OutputTable rows={tableRows} lastIdx={lastIdx} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default PyretTab
