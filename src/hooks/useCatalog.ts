import { useCallback, useEffect, useState } from 'react'
import { useHousehold } from '../contexts/HouseholdContext'
import { useAuth } from '../contexts/AuthContext'
import { addCustomCatalogItem, subscribeToCatalog, updateCatalogItemTags } from '../firebase/catalog'
import type { Category, CatalogItem, DietTags } from '../types/models'

export function useCatalog() {
  const { householdId } = useHousehold()
  const { uid } = useAuth()
  const [items, setItems] = useState<CatalogItem[]>([])

  useEffect(() => {
    if (!householdId) {
      setItems([])
      return
    }
    return subscribeToCatalog(householdId, setItems, (err) => console.error('Catalog subscription failed', err))
  }, [householdId])

  const addCustomItem = useCallback(
    async (name: string, dietTags?: DietTags, category?: Category): Promise<CatalogItem> => {
      if (!householdId || !uid) throw new Error('No household to add to')
      const { id, name: savedName } = await addCustomCatalogItem(householdId, uid, name, dietTags, category)
      return { id, name: savedName, nameLower: savedName.toLowerCase(), source: 'custom', dietTags, category }
    },
    [householdId, uid],
  )

  const updateDietTags = useCallback(
    (itemId: string, dietTags: DietTags) => {
      if (!householdId) return
      updateCatalogItemTags(householdId, itemId, dietTags).catch((err: unknown) =>
        console.error('Failed to update diet tags', err),
      )
    },
    [householdId],
  )

  return { items, addCustomItem, updateDietTags }
}
