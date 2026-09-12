import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { SourceList, ThisWeekItem } from '../types/models'

export function useThisWeekList() {
  const [items, setItems] = useLocalStorage<ThisWeekItem[]>('thisWeek.items', [])

  const addItem = useCallback(
    (catalogItemId: string, name: string, sourceList: SourceList) => {
      setItems((current) => {
        if (current.some((item) => item.catalogItemId === catalogItemId)) return current
        const newItem: ThisWeekItem = {
          catalogItemId,
          name,
          sourceList,
          checked: false,
          addedAt: Date.now(),
        }
        return [...current, newItem]
      })
    },
    [setItems],
  )

  const toggleChecked = useCallback(
    (catalogItemId: string) => {
      setItems((current) =>
        current.map((item) =>
          item.catalogItemId === catalogItemId
            ? {
                ...item,
                checked: !item.checked,
                checkedAt: !item.checked ? Date.now() : undefined,
              }
            : item,
        ),
      )
    },
    [setItems],
  )

  const removeItem = useCallback(
    (catalogItemId: string) => {
      setItems((current) => current.filter((item) => item.catalogItemId !== catalogItemId))
    },
    [setItems],
  )

  const clearChecked = useCallback(() => {
    setItems((current) => current.filter((item) => !item.checked))
  }, [setItems])

  const addedIds = useMemo(() => new Set(items.map((item) => item.catalogItemId)), [items])

  return { items, addItem, toggleChecked, removeItem, clearChecked, addedIds }
}
