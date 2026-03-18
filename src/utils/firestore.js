import { db } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export async function saveProgress(userId, lessonId, progressData) {
  try {
    await setDoc(doc(db, 'progress', userId, 'lessons', lessonId), progressData, { merge: true })
  } catch (err) {
    console.error('Error saving progress:', err)
  }
}

export async function loadProgress(userId, lessonId) {
  try {
    const snap = await getDoc(doc(db, 'progress', userId, 'lessons', lessonId))
    return snap.exists() ? snap.data() : null
  } catch (err) {
    console.error('Error loading progress:', err)
    return null
  }
}

export async function saveUnlockedLessons(userId, unlockedLessons) {
  try {
    await setDoc(doc(db, 'progress', userId, 'meta', 'unlocked'), { unlockedLessons }, { merge: true })
  } catch (err) {
    console.error('Error saving unlocked lessons:', err)
  }
}

export async function loadUnlockedLessons(userId) {
  try {
    const snap = await getDoc(doc(db, 'progress', userId, 'meta', 'unlocked'))
    return snap.exists() ? snap.data().unlockedLessons : [0]
  } catch (err) {
    console.error('Error loading unlocked lessons:', err)
    return [0]
  }
}