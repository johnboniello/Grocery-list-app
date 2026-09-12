import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useTagOverrides } from './useTagOverrides'
import catalogSeed from '../firebase/seedData/catalog.json'
import type { CatalogItem, DietTags } from '../types/models'

interface SeedRow {
  id: string
  name: string
  dietTags?: DietTags
}

const SEED_ITEMS: CatalogItem[] = (catalogSeed as SeedRow[]).map((item) => ({
  id: item.id,
  name: item.name,
  nameLower: item.name.toLowerCase(),
  source: 'seed',
  dietTags: item.dietTags,
}))

function slugify(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug ? `custom-${slug}` : `custom-${Date.now()}`
}

export function useCatalog() {
  const [customItems, setCustomItems] = useLocalStorage<CatalogItem[]>('catalog.custom', [])
  const { overrides, setOverride } = useTagOverrides()

  const items = useMemo<CatalogItem[]>(() => {
    const merged = [...SEED_ITEMS, ...customItems]
    return merged.map((item) => (overrides[item.id] ? { ...item, dietTags: overrides[item.id] } : item))
  }, [customItems, overrides])

  const addCustomItem = useCallback(
    (name: string, dietTags?: DietTags): CatalogItem => {
      const trimmed = name.trim()
      const nameLower = trimmed.toLowerCase()
      const existing = items.find((item) => item.nameLower === nameLower)
      if (existing) return existing

      const newItem: CatalogItem = {
        id: slugify(trimmed),
        name: trimmed,
        nameLower,
        source: 'custom',
        dietTags,
      }
      setCustomItems((current) => [...current, newItem])
      return newItem
    },
    [items, setCustomItems],
  )

  const updateDietTags = useCallback(
    (itemId: string, dietTags: DietTags) => {
      const isCustom = customItems.some((item) => item.id === itemId)
      if (isCustom) {
        setCustomItems((current) =>
          current.map((item) => (item.id === itemId ? { ...item, dietTags } : item)),
        )
      } else {
        setOverride(itemId, dietTags)
      }
    },
    [customItems, setCustomItems, setOverride],
  )

  return { items, addCustomItem, updateDietTags }
}
