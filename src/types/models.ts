export type DietRestriction =
  | 'dairyFree'
  | 'glutenFree'
  | 'modifiedAIP'
  | 'lowCarb'
  | 'vegan'

export const DIET_RESTRICTIONS: DietRestriction[] = [
  'dairyFree',
  'glutenFree',
  'modifiedAIP',
  'lowCarb',
  'vegan',
]

export const DIET_LABELS: Record<DietRestriction, string> = {
  dairyFree: 'Dairy-Free',
  glutenFree: 'Gluten-Free',
  modifiedAIP: 'Modified AIP',
  lowCarb: 'Low-Carb',
  vegan: 'Vegan',
}

/** true = known to meet the restriction, false = known to fail it, missing = not yet tagged. */
export type DietTags = Partial<Record<DietRestriction, boolean>>

export type BuiltInCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'pantry'
  | 'frozen'
  | 'beverages'
  | 'condiments'
  | 'snacks'
  | 'spices'
  | 'household'

/**
 * A built-in category's key, or the name of one the household made up (e.g. "Deli"). Custom
 * categories have no list of their own: they exist as long as some item is filed under them.
 */
export type Category = string

/** Display order for category pickers and category-sorted lists. */
export const CATEGORIES: BuiltInCategory[] = [
  'produce',
  'dairy',
  'meat',
  'bakery',
  'pantry',
  'frozen',
  'beverages',
  'condiments',
  'snacks',
  'spices',
  'household',
]

export const CATEGORY_LABELS: Record<BuiltInCategory, string> = {
  produce: 'Produce',
  dairy: 'Dairy & Eggs',
  meat: 'Meat & Seafood',
  bakery: 'Bakery',
  pantry: 'Pantry',
  frozen: 'Frozen',
  beverages: 'Beverages',
  condiments: 'Condiments & Sauces',
  snacks: 'Snacks',
  spices: 'Spices',
  household: 'Household',
}

export function isBuiltInCategory(category: Category): category is BuiltInCategory {
  return (CATEGORIES as string[]).includes(category)
}

export function categoryLabel(category: Category): string {
  return isBuiltInCategory(category) ? CATEGORY_LABELS[category] : category
}

export interface CatalogItem {
  id: string
  name: string
  nameLower: string
  source: 'seed' | 'custom'
  dietTags?: DietTags
  category?: Category
}

export type SourceList = 'highFrequency' | 'lessFrequent' | 'catalog'

export interface StaticListItem {
  catalogItemId: string
  name: string
  dietTags?: DietTags
  category?: Category
}

export interface ThisWeekItem {
  catalogItemId: string
  name: string
  sourceList: SourceList
  checked: boolean
  addedAt: number
  checkedAt?: number
  /** Optional free-text detail for this week's purchase, e.g. "chunky Skippy". */
  note?: string
  /** How many are needed. Absent means 1. */
  quantity?: number
  /** How many have been found so far. Absent means 0; only tracked when quantity > 1. */
  found?: number
}
