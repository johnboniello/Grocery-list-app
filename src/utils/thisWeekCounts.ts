import type { ThisWeekItem } from '../types/models'

export const MAX_QUANTITY = 99

export interface Counts {
  quantity: number
  found: number
  checked: boolean
}

export interface CountsPatch {
  quantity?: number
  found?: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)))
}

export function itemCounts(item: ThisWeekItem): Counts {
  return { quantity: item.quantity ?? 1, found: item.found ?? 0, checked: item.checked }
}

/**
 * Applies a quantity/found change. Finding everything ticks the item off, and dropping back below the
 * needed amount unticks it. A single item that was already ticked counts as 1 found if the quantity is
 * raised. Otherwise `checked` is left alone, so an item ticked off with fewer than needed stays ticked.
 */
export function applyCounts(item: ThisWeekItem, patch: CountsPatch): Counts {
  const before = itemCounts(item)
  const quantity = clamp(patch.quantity ?? before.quantity, 1, MAX_QUANTITY)
  const singleTicked = before.quantity === 1 && before.checked
  const wasComplete = before.quantity > 1 && before.found >= before.quantity
  const foundBase = patch.found ?? (singleTicked && quantity > 1 ? 1 : before.found)
  const found = quantity > 1 ? clamp(foundBase, 0, quantity) : 0

  let checked = before.checked
  if (quantity > 1) {
    if (found >= quantity && !wasComplete) checked = true
    else if (found < quantity && (wasComplete || singleTicked)) checked = false
  }
  return { quantity, found, checked }
}

/**
 * Ticking an untouched multi-quantity item marks all of it found; unticking undoes that. A partial count is
 * kept, so ticking with 1 of 2 found means "accept fewer" and the row still reads "1 of 2".
 */
export function toggleCounts(item: ThisWeekItem): Counts {
  const before = itemCounts(item)
  const checked = !before.checked
  let found = before.found
  if (before.quantity > 1) {
    if (checked && found === 0) found = before.quantity
    else if (!checked && found >= before.quantity) found = 0
  }
  return { quantity: before.quantity, found, checked }
}
