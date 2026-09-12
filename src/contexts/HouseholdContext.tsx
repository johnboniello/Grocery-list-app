import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { clearOwnHouseholdPointer } from '../firebase/household'
import { useAuth } from './AuthContext'

interface HouseholdContextValue {
  householdId: string | null
  memberUids: string[]
  loading: boolean
  justRevoked: boolean
  dismissRevoked: () => void
}

const HouseholdContext = createContext<HouseholdContextValue>({
  householdId: null,
  memberUids: [],
  loading: true,
  justRevoked: false,
  dismissRevoked: () => {},
})

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { uid } = useAuth()
  const [householdId, setHouseholdId] = useState<string | null>(null)
  const [memberUids, setMemberUids] = useState<string[]>([])
  const [loadingPointer, setLoadingPointer] = useState(true)
  const [loadingHousehold, setLoadingHousehold] = useState(false)
  const [justRevoked, setJustRevoked] = useState(false)

  // Step 1: find out which household (if any) this device belongs to.
  useEffect(() => {
    if (!uid) return
    const unsubscribe = onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        setHouseholdId((snap.data()?.householdId as string | null | undefined) ?? null)
        setLoadingPointer(false)
      },
      () => setLoadingPointer(false),
    )
    return unsubscribe
  }, [uid])

  // Step 2: once we know the household, subscribe to its member list. A
  // permission-denied error here means this device was revoked mid-session.
  useEffect(() => {
    if (!householdId || !uid) {
      setMemberUids([])
      return
    }
    setLoadingHousehold(true)
    const unsubscribe = onSnapshot(
      doc(db, 'households', householdId),
      (snap) => {
        setMemberUids((snap.data()?.memberUids as string[] | undefined) ?? [])
        setLoadingHousehold(false)
      },
      (error) => {
        if (error.code === 'permission-denied') {
          setJustRevoked(true)
          clearOwnHouseholdPointer(uid).catch(() => {})
        }
        setLoadingHousehold(false)
      },
    )
    return unsubscribe
  }, [householdId, uid])

  const value: HouseholdContextValue = {
    householdId,
    memberUids,
    loading: loadingPointer || loadingHousehold,
    justRevoked,
    dismissRevoked: () => setJustRevoked(false),
  }

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>
}

export function useHousehold(): HouseholdContextValue {
  return useContext(HouseholdContext)
}
