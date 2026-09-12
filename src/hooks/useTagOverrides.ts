import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { DietTags } from '../types/models'

/**
 * Shared store for diet-tag edits made to any seed item (catalog, high-frequency,
 * or less-frequent) — keyed by item id so the same edit is visible everywhere
 * that item appears, regardless of which tab it was edited from.
 */
export function useTagOverrides() {
  const [overrides, setOverrides] = useLocalStorage<Record<string, DietTags>>(
    'dietTagOverrides',
    {},
  )

  const setOverride = useCallback(
    (itemId: string, dietTags: DietTags) => {
      setOverrides((current) => ({ ...current, [itemId]: dietTags }))
    },
    [setOverrides],
  )

  return { overrides, setOverride }
}
