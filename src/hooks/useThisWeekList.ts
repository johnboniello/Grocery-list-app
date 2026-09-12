import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useAuth } from '../contexts/AuthContext'
import {
  addThisWeekItem,
  clearCheckedThisWeekItems,
  removeThisWeekItem,
  subscribeToThisWeek,
  toggleThisWeekChecked,
} from '../firebase/thisWeek'
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

  const toggleChecked = useCallback(
    (catalogItemId: string) => {
      if (!householdId || !uid) return
      const item = items.find((i) => i.catalogItemId === catalogItemId)
      if (!item) return
      toggleThisWeekChecked(householdId, catalogItemId, !item.checked, uid).catch((err: unknown) =>
        console.error('Failed to toggle item', err),
      )
    },
    [householdId, uid, items],
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

  return { items, addItem, toggleChecked, removeItem, clearChecked, addedIds }
}
