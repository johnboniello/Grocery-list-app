import { useMemo } from 'react'
import { useTagOverrides } from './useTagOverrides'
import type { DietTags, StaticListItem } from '../types/models'

interface SeedRow {
  id: string
  name: string
  dietTags?: DietTags
}

export function useStaticList(seedRows: SeedRow[]): StaticListItem[] {
  const { overrides } = useTagOverrides()

  return useMemo(
    () =>
      seedRows.map((row) => ({
        catalogItemId: row.id,
        name: row.name,
        dietTags: overrides[row.id] ?? row.dietTags,
      })),
    [seedRows, overrides],
  )
}
