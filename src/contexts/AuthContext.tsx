import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from '../firebase/config'

interface AuthContextValue {
  uid: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ uid: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid)
        setLoading(false)
      } else {
        signInAnonymously(auth).catch((err: unknown) => {
          console.error('Anonymous sign-in failed', err)
          setLoading(false)
        })
      }
    })
    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ uid, loading }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
