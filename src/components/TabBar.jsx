const TABS = ['task', 'desmos', 'pyret', 'check']

// activeTab: currently selected tab
// onTabChange: function to call when user clicks a tab
function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="tabs" role="tablist" aria-label="IDE tabs">
      {TABS.map(tab => (
        <button
          key={tab}
          role="tab"
          id={`tab-${tab}`}
          aria-selected={activeTab === tab}
          aria-controls={`panel-${tab}`}
          className={`tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {/* Capitalize first letter for display */}
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  )
}

export default TabBar