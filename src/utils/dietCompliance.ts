import type { DietRestriction, DietTags } from '../types/models'

export type ComplianceStatus = 'pass' | 'fail' | 'unknown' | 'none'

/**
 * A confirmed failure always wins over "not tagged" — an item is never shown
 * as green (pass) when we simply don't have data for one of the active
 * restrictions, since these toggles may stand in for real allergies.
 */
export function computeCompliance(
  dietTags: DietTags | undefined,
  activeRestrictions: DietRestriction[],
): ComplianceStatus {
  if (activeRestrictions.length === 0) return 'none'

  let hasUnknown = false
  for (const restriction of activeRestrictions) {
    const value = dietTags?.[restriction]
    if (value === false) return 'fail'
    if (value === undefined) hasUnknown = true
  }
  return hasUnknown ? 'unknown' : 'pass'
}
