import { useCallback } from 'react'
import { useHousehold } from '../contexts/HouseholdContext'
import { deleteItem, renameItem, updateItemCategory } from '../firebase/lists'
import type { Category, SourceList } from '../types/models'

/** Category, rename and delete for the items of one source list. `addedIds` is what's on This Week. */
export function useItemActions(collectionName: SourceList, addedIds: Set<string>) {
  const { householdId } = useHousehold()

  const setCategory = useCallback(
    (itemId: string, category: Category | undefined) => {
      if (!householdId) return
      updateItemCategory(householdId, collectionName, itemId, category).catch((err: unknown) =>
        console.error('Failed to update category', err),
      )
    },
    [householdId, collectionName],
  )

  const rename = useCallback(
    (itemId: string, name: string) => {
      if (!householdId) return
      renameItem(householdId, collectionName, itemId, name, addedIds.has(itemId)).catch((err: unknown) =>
        console.error('Failed to rename item', err),
      )
    },
    [householdId, collectionName, addedIds],
  )

  const remove = useCallback(
    (itemId: string) => {
      if (!householdId) return
      deleteItem(householdId, collectionName, itemId).catch((err: unknown) =>
        console.error('Failed to delete item', err),
      )
    },
    [householdId, collectionName],
  )

  return { setCategory, rename, remove }
}
