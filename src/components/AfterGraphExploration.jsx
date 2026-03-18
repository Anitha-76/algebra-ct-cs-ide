function AfterGraphExploration({ afterGraph }) {
  return (
    <div className="after-graph-section">
      <h3 className="section-title">🔍 {afterGraph.title}</h3>
      
      <div className="exploration-questions">
        {afterGraph.questions.map((question, i) => (
          <div key={i} className="question-item">
            <p><strong>{i + 1}.</strong> {question}</p>
          </div>
        ))}
      </div>

      <div className="key-insight-box">
        <h4 className="insight-title">💡 {afterGraph.keyInsight.title}</h4>
        <p className="insight-content">{afterGraph.keyInsight.content}</p>
      </div>

      <div className="axis-labels-info">
        <p>📝 {afterGraph.axisLabels.x}</p>
        <p>📝 {afterGraph.axisLabels.y}</p>
      </div>
    </div>
  )
}

export default AfterGraphExploration