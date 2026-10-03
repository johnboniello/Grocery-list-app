import { CATEGORIES, categoryLabel, isBuiltInCategory, type Category } from '../types/models'

export interface ItemGroup<T> {
  key: string
  label: string
  items: T[]
}

/**
 * Alphabetical within each category group. Groups are ordered built-ins first (in CATEGORIES
 * order), then the household's own categories alphabetically, then uncategorized last.
 */
export function groupByCategory<T>(
  items: T[],
  getCategory: (item: T) => Category | undefined,
  getName: (item: T) => string,
): ItemGroup<T>[] {
  const buckets = new Map<Category | 'other', T[]>()
  for (const item of items) {
    const key = getCategory(item) ?? 'other'
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(item)
  }
  const custom = [...buckets.keys()]
    .filter((key) => key !== 'other' && !isBuiltInCategory(key))
    .sort((a, b) => a.localeCompare(b))
  const order: (Category | 'other')[] = [...CATEGORIES, ...custom, 'other']
  return order
    .filter((key) => buckets.has(key))
    .map((key) => ({
      key,
      label: key === 'other' ? 'Other' : categoryLabel(key),
      items: [...buckets.get(key)!].sort((a, b) => getName(a).localeCompare(getName(b))),
    }))
}

/** Single ungrouped, alphabetically sorted group — same shape as groupByCategory for uniform rendering. */
export function sortAlphabetical<T>(items: T[], getName: (item: T) => string): ItemGroup<T>[] {
  return [{ key: 'all', label: '', items: [...items].sort((a, b) => getName(a).localeCompare(getName(b))) }]
}
