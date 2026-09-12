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

export interface CatalogItem {
  id: string
  name: string
  nameLower: string
  source: 'seed' | 'custom'
  dietTags?: DietTags
}

export type SourceList = 'highFrequency' | 'lessFrequent' | 'catalog'

export interface StaticListItem {
  catalogItemId: string
  name: string
  dietTags?: DietTags
}

export interface ThisWeekItem {
  catalogItemId: string
  name: string
  sourceList: SourceList
  checked: boolean
  addedAt: number
  checkedAt?: number
}
