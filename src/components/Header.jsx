// Receives lesson title and subtitle from App.jsx via props
function Header({ title, subtitle }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="appname">{title}</span>
        <span className="subtitle">{subtitle}</span>
      </div>
      <div className="actions">
        <button type="button">Save</button>
        <button type="button">Load</button>
      </div>
    </header>
  )
}

export default Header