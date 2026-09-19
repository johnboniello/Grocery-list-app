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

export type Category =
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

/** Display order for category pickers and category-sorted lists. */
export const CATEGORIES: Category[] = [
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

export const CATEGORY_LABELS: Record<Category, string> = {
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
}
