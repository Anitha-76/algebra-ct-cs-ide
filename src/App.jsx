import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { saveProgress, loadProgress, saveUnlockedLessons, loadUnlockedLessons } from './utils/firestore'
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
import Login from './components/Login'

const allLessons = [l0, l1, l2, l3]

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
//  const [activeTab, setActiveTab] = useState('task')
const [activeTab, setActiveTab] = useState('pyret')
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [unlockedLessons, setUnlockedLessons] = useState([0])
  const [lessonProgress, setLessonProgress] = useState({})
  const [tablePoints, setTablePoints] = useState([])
  const [predictionMade, setPredictionMade] = useState(false)
  const [userPrediction, setUserPrediction] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
      if (firebaseUser) {
        const unlocked = await loadUnlockedLessons(firebaseUser.uid)
        setUnlockedLessons(unlocked)
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) return
    const lesson = allLessons[currentLessonIndex]
    loadProgress(user.uid, lesson.id).then(data => {
      if (data) {
        setLessonProgress(data.lessonProgress || {})
        setTablePoints(data.tablePoints || [])
        setPredictionMade(data.predictionMade || false)
        setUserPrediction(data.userPrediction || null)
      } else {
        setLessonProgress({})
        setTablePoints([])
        setPredictionMade(false)
        setUserPrediction(null)
      }
    })
  }, [user, currentLessonIndex])

  const lesson = allLessons[currentLessonIndex]

  async function handleReset() {
    if (!user) return
    await saveProgress(user.uid, lesson.id, {
      lessonProgress: {},
      tablePoints: [],
      predictionMade: false,
      userPrediction: null
    })
    await saveUnlockedLessons(user.uid, [0])
    setLessonProgress({})
    setTablePoints([])
    setPredictionMade(false)
    setUserPrediction(null)
    setCurrentLessonIndex(0)
    setUnlockedLessons([0])
    setActiveTab('task')
  }

  async function handleLessonComplete() {
    const nextIndex = currentLessonIndex + 1
    if (nextIndex < allLessons.length) {
      const updated = unlockedLessons.includes(nextIndex)
        ? unlockedLessons
        : [...unlockedLessons, nextIndex]
      setUnlockedLessons(updated)
      if (user) await saveUnlockedLessons(user.uid, updated)
    }
  }

  async function handleLessonSelect(index) {
    if (unlockedLessons.includes(index)) {
      setCurrentLessonIndex(index)
      setActiveTab('task')
    }
  }

  async function updateStepProgress(stepId, updates) {
    const updated = {
      ...lessonProgress,
      [stepId]: {
        ...lessonProgress[stepId],
        ...updates
      }
    }
    setLessonProgress(updated)
    if (user) {
      await saveProgress(user.uid, lesson.id, {
        lessonProgress: updated,
        tablePoints,
        predictionMade,
        userPrediction
      })
    }
  }

  async function handleTableComplete(points) {
    setTablePoints(points)
    if (user) {
      await saveProgress(user.uid, lesson.id, {
        lessonProgress,
        tablePoints: points,
        predictionMade,
        userPrediction
      })
    }
  }

  async function handlePredictionSubmit(value) {
    setPredictionMade(true)
    setUserPrediction(value)
    const updated = {
      ...lessonProgress,
      'desmos-prediction': { prediction: value }
    }
    setLessonProgress(updated)
    if (user) {
      await saveProgress(user.uid, lesson.id, {
        lessonProgress: updated,
        tablePoints,
        predictionMade: true,
        userPrediction: value
      })
    }
  }

  if (authLoading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>
  }

  if (!user) {
    return <Login onLogin={() => {}} />
  }

  return (
    <div>
      <Header
        title={lesson.title}
        subtitle={lesson.subtitle}
        onReset={handleReset}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</span>
          <button
            onClick={() => signOut(auth)}
            style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
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