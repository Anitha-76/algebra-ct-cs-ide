function Header({ title, subtitle, onReset }) {
  function handleReset() {
    const confirmed = window.confirm('Are you sure you want to start over? All your progress for this lesson will be cleared.')
    if (confirmed) onReset()
  }
  return (
    <header className="topbar">
      <div className="brand">
        <span className="appname">{title}</span>
        <span className="subtitle">{subtitle}</span>
      </div>
      <div className="actions">
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: '10px 22px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#fff',
            background: '#dc2626',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(220,38,38,0.35)',
            transition: 'background 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#b91c1c'
            e.currentTarget.style.boxShadow  = '0 4px 14px rgba(220,38,38,0.45)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#dc2626'
            e.currentTarget.style.boxShadow  = '0 2px 8px rgba(220,38,38,0.35)'
          }}
        >
          Start Over
        </button>
      </div>
    </header>
  )
}
export default Header
