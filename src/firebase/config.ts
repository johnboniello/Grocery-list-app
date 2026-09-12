import { initializeApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)

// Offline persistence is Firestore's job — the PWA service worker only caches
// the app shell (JS/CSS/HTML), never this traffic.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})

export const auth = getAuth(app)
