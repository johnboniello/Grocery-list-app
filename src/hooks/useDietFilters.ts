import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { DietRestriction } from '../types/models'

/** Per-device only (not synced) — which restrictions apply can differ between household members. */
export function useDietFilters() {
  const [activeRestrictions, setActiveRestrictions] = useLocalStorage<DietRestriction[]>(
    'dietFilters.active',
    [],
  )

  const toggle = useCallback(
    (restriction: DietRestriction) => {
      setActiveRestrictions((current) =>
        current.includes(restriction)
          ? current.filter((r) => r !== restriction)
          : [...current, restriction],
      )
    },
    [setActiveRestrictions],
  )

  return { activeRestrictions, toggle }
}
