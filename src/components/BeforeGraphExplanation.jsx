function BeforeGraphExplanation({ beforeGraph, tablePoints, userPrediction }) {
  return (
    <div className="before-graph-section">
      <h3 className="section-title">🔗 {beforeGraph.title}</h3>

      {/* Table to graph mapping */}
      <div className="table-mapping">
        <p className="mapping-intro">Each row from your table becomes a point on the graph:</p>

        <table className="mapping-table">
          <thead>
            <tr>
              <th>📊 Table Row</th>
              <th></th>
              <th>📍 Graph Point</th>
            </tr>
          </thead>
          <tbody>
            {beforeGraph.tableMapping.map((mapping, i) => (
              <tr key={i}>
                <td className="table-row-cell">{mapping.tableRow}</td>
                <td className="arrow-cell">→</td>
                <td className="graph-point-cell">{mapping.graphPoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="graph-legend">
        {beforeGraph.legend.map((item, i) => (
          <p key={i} className="legend-item">{item}</p>
        ))}
      </div>

      <p className="notice-text">{beforeGraph.notice}</p>

      {/* Reference student's prediction */}
      {userPrediction && (
        <div className="prediction-reference">
          <p>
            You predicted: <strong>{userPrediction}</strong> — does the graph match what you expected?
          </p>
        </div>
      )}
    </div>
  )
}

export default BeforeGraphExplanation