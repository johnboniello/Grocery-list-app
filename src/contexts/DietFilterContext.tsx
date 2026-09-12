import { createContext, useContext, type ReactNode } from 'react'
import { useDietFilters } from '../hooks/useDietFilters'
import type { DietRestriction } from '../types/models'

interface DietFilterContextValue {
  activeRestrictions: DietRestriction[]
  toggle: (restriction: DietRestriction) => void
}

const DietFilterContext = createContext<DietFilterContextValue | null>(null)

export function DietFilterProvider({ children }: { children: ReactNode }) {
  const value = useDietFilters()
  return <DietFilterContext.Provider value={value}>{children}</DietFilterContext.Provider>
}

export function useDietFilterContext(): DietFilterContextValue {
  const ctx = useContext(DietFilterContext)
  if (!ctx) throw new Error('useDietFilterContext must be used within a DietFilterProvider')
  return ctx
}
