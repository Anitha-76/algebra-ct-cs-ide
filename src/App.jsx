import { useState } from 'react'
import l0 from './lessons/lesson-l0.json'
import l1 from './lessons/lesson-l1.json'
import l2 from './lessons/lesson-l2.json'
import l3 from './lessons/lesson-l3.json'
import Header from './components/Header'
import TabBar from './components/TabBar'
import TaskTab from './components/TaskTab'
import DesmosTab from './components/DesmosTab'
import PyretTab from './components/PyretTab'
import CheckTab from './components/CheckTab'

const allLessons = [l0, l1, l2, l3]

function App() {
  const [activeTab, setActiveTab] = useState('task')
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [unlockedLessons, setUnlockedLessons] = useState([0])
  const [lessonProgress, setLessonProgress] = useState({})
  const [tablePoints, setTablePoints] = useState([])
  const [predictionMade, setPredictionMade] = useState(false)
  const [userPrediction, setUserPrediction] = useState(null)

  const lesson = allLessons[currentLessonIndex]

  function handleLessonComplete() {
    const nextIndex = currentLessonIndex + 1
    if (nextIndex < allLessons.length) {
      setUnlockedLessons(prev =>
        prev.includes(nextIndex) ? prev : [...prev, nextIndex]
      )
    }
  }

  function handleLessonSelect(index) {
    if (unlockedLessons.includes(index)) {
      setCurrentLessonIndex(index)
      setActiveTab('task')
      setLessonProgress({})
      setTablePoints([])
      setPredictionMade(false)
      setUserPrediction(null)
    }
  }

  function updateStepProgress(stepId, updates) {
    setLessonProgress(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        ...updates
      }
    }))
  }

  function handleTableComplete(points) {
    setTablePoints(points)
  }

  function handlePredictionSubmit(value) {
    setPredictionMade(true)
    setUserPrediction(value)
    updateStepProgress('desmos-prediction', { prediction: value })
  }

  return (
    <div>
      <Header title={lesson.title} subtitle={lesson.subtitle} />

      <div style={{ display: 'flex', gap: '8px', padding: '12px' }}>
        {allLessons.map((l, index) => (
          <button
            key={l.id}
            onClick={() => handleLessonSelect(index)}
            disabled={!unlockedLessons.includes(index)}
            style={{
              padding: '6px 12px',
              background: currentLessonIndex === index ? '#4f46e5' : '#e5e7eb',
              color: currentLessonIndex === index ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: unlockedLessons.includes(index) ? 'pointer' : 'not-allowed',
              opacity: unlockedLessons.includes(index) ? 1 : 0.4
            }}
          >
            {l.subtitle}
          </button>
        ))}
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main">
        {activeTab === 'task' && (
          <TaskTab
            steps={lesson.steps}
            problem={lesson.problem}
            progress={lessonProgress}
            onUpdateProgress={updateStepProgress}
            onTableComplete={handleTableComplete}
          />
        )}

        {activeTab === 'desmos' && (
          <DesmosTab
            desmos={lesson.desmos}
            tablePoints={tablePoints}
            onPredictionSubmit={handlePredictionSubmit}
            predictionMade={predictionMade}
            userPrediction={userPrediction}
          />
        )}

        {activeTab === 'pyret' && (
          <PyretTab pyret={lesson.pyret} />
        )}

        {activeTab === 'check' && (
          <CheckTab
            check={lesson.check}
            progress={lessonProgress}
            onComplete={handleLessonComplete}
          />
        )}
      </main>
    </div>
  )
}

export default App