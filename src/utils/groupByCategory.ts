import { CATEGORIES, CATEGORY_LABELS, type Category } from '../types/models'

export interface ItemGroup<T> {
  key: string
  label: string
  items: T[]
}

/** Alphabetical within each category group; groups ordered by CATEGORIES, uncategorized last. */
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
  const order: (Category | 'other')[] = [...CATEGORIES, 'other']
  return order
    .filter((key) => buckets.has(key))
    .map((key) => ({
      key,
      label: key === 'other' ? 'Other' : CATEGORY_LABELS[key],
      items: [...buckets.get(key)!].sort((a, b) => getName(a).localeCompare(getName(b))),
    }))
}

/** Single ungrouped, alphabetically sorted group — same shape as groupByCategory for uniform rendering. */
export function sortAlphabetical<T>(items: T[], getName: (item: T) => string): ItemGroup<T>[] {
  return [{ key: 'all', label: '', items: [...items].sort((a, b) => getName(a).localeCompare(getName(b))) }]
}
