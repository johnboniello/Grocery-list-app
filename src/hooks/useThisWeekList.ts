import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useAuth } from '../contexts/AuthContext'
import {
  addThisWeekItem,
  clearCheckedThisWeekItems,
  removeThisWeekItem,
  subscribeToThisWeek,
  toggleThisWeekChecked,
  updateThisWeekCounts,
  updateThisWeekNote,
} from '../firebase/thisWeek'
import { applyCounts, toggleCounts, type Counts, type CountsPatch } from '../utils/thisWeekCounts'
import type { SourceList, ThisWeekItem } from '../types/models'

export function useThisWeekList() {
  const { householdId } = useHousehold()
  const { uid } = useAuth()
  const [items, setItems] = useState<ThisWeekItem[]>([])

  useEffect(() => {
    if (!householdId) {
      setItems([])
      return
    }
    return subscribeToThisWeek(householdId, setItems, (err) => console.error('This Week subscription failed', err))
  }, [householdId])

  const addedIds = useMemo(() => new Set(items.map((item) => item.catalogItemId)), [items])

  const addItem = useCallback(
    (catalogItemId: string, name: string, sourceList: SourceList) => {
      if (!householdId || !uid || addedIds.has(catalogItemId)) return
      addThisWeekItem(householdId, uid, catalogItemId, name, sourceList).catch((err: unknown) =>
        console.error('Failed to add item', err),
      )
    },
    [householdId, uid, addedIds],
  )

  /** Only sends `checked` when it actually changed, so checkedBy/checkedAt aren't rewritten on every count tweak. */
  const writeCounts = useCallback(
    (item: ThisWeekItem, next: Counts) => {
      if (!householdId || !uid) return Promise.resolve()
      const checked = next.checked === item.checked ? undefined : next.checked
      return updateThisWeekCounts(householdId, item.catalogItemId, { quantity: next.quantity, found: next.found, checked }, uid)
    },
    [householdId, uid],
  )

  const toggleChecked = useCallback(
    (catalogItemId: string) => {
      if (!householdId || !uid) return
      const item = items.find((i) => i.catalogItemId === catalogItemId)
      if (!item) return
      const write =
        (item.quantity ?? 1) > 1
          ? writeCounts(item, toggleCounts(item))
          : toggleThisWeekChecked(householdId, catalogItemId, !item.checked, uid)
      write.catch((err: unknown) => console.error('Failed to toggle item', err))
    },
    [householdId, uid, items, writeCounts],
  )

  const setCounts = useCallback(
    (catalogItemId: string, patch: CountsPatch) => {
      const item = items.find((i) => i.catalogItemId === catalogItemId)
      if (!item) return
      writeCounts(item, applyCounts(item, patch)).catch((err: unknown) => console.error('Failed to update counts', err))
    },
    [items, writeCounts],
  )

  const setNote = useCallback(
    (catalogItemId: string, note: string) => {
      if (!householdId) return
      updateThisWeekNote(householdId, catalogItemId, note).catch((err: unknown) =>
        console.error('Failed to update note', err),
      )
    },
    [householdId],
  )

  const removeItem = useCallback(
    (catalogItemId: string) => {
      if (!householdId) return
      removeThisWeekItem(householdId, catalogItemId).catch((err: unknown) => console.error('Failed to remove item', err))
    },
    [householdId],
  )

  const clearChecked = useCallback(() => {
    if (!householdId) return
    const checkedIds = items.filter((item) => item.checked).map((item) => item.catalogItemId)
    if (checkedIds.length === 0) return
    clearCheckedThisWeekItems(householdId, checkedIds).catch((err: unknown) =>
      console.error('Failed to clear checked items', err),
    )
  }, [householdId, items])

  return { items, addItem, toggleChecked, setNote, setCounts, removeItem, clearChecked, addedIds }
}
