import { useEffect, useRef } from 'react'
import { makeEmbed } from '@ironm00n/pyret-embed/api'

function PyretTab({ pyret }) {
  const embedRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!embedRef.current && containerRef.current) {
      makeEmbed('pyret-1', containerRef.current).then(embed => {
        embedRef.current = embed
        embed.sendReset({
          editorContents: pyret.starterCode,
          replContents: '',
          definitionsAtLastRun: '',
          interactionsSinceLastRun: []
        })
      })
    }
  }, [])

  return (
    <div className="panel" role="tabpanel" id="panel-pyret">

      {/* Purpose Banner */}
      {pyret.purpose && (
        <div className="pyret-purpose">
          <p>{pyret.purpose}</p>
        </div>
      )}

      {/* Instruction Panel */}
      <div className="pyret-instruction-panel">
        <h3 className="pyret-instruction-title">🎯 What to do here</h3>
        <p className="pyret-instruction-text">
          <strong>Step 1:</strong> Read the comments in the code below. Each line has a note explaining what it does.
        </p>
        <p className="pyret-instruction-text">
          <strong>Step 2:</strong> Click <strong>Run</strong> to load your rule into the computer.
        </p>
        <p className="pyret-instruction-text">
          <strong>Step 3:</strong> In the <strong>&gt;&gt;&gt;</strong> box, type <code>thamarai-age(12)</code> and press <strong>Enter</strong> to see Thamarai's age when Selvi is 12. Try different ages!
        </p>
        <p className="pyret-instruction-note">
          💡 The code is doing the same calculation you did by hand in the Task tab — but instantly, for any number you give it.
        </p>
      </div>

      {/* Pyret Embed */}
      <div className="pyret-embed-section">
        <h3 className="pyret-section-title">Read and Run the code</h3>
        <div ref={containerRef} className="pyret" />
      </div>

    </div>
  )
}

export default PyretTab