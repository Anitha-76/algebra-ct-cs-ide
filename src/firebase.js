import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBlvSgNs3jDf9izhi0x06X5kKOXumuF1M0",
  authDomain: "algebra-ide.firebaseapp.com",
  projectId: "algebra-ide",
  storageBucket: "algebra-ide.firebasestorage.app",
  messagingSenderId: "581033284067",
  appId: "1:581033284067:web:a88bd643257d071e4310d6"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)