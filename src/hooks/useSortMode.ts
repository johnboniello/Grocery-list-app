import { useLocalStorage } from './useLocalStorage'

export type SortMode = 'alphabetical' | 'category'

/** Shared across every list screen so the choice sticks as you switch tabs. */
export function useSortMode() {
  return useLocalStorage<SortMode>('sortMode', 'alphabetical')
}
