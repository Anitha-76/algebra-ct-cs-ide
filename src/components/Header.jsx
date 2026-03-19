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
        <button type="button" onClick={handleReset}>Start Over</button>
      </div>
    </header>
  )
}

export default Header