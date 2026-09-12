import { useMemo } from 'react'
import { ThisWeekList } from '../components/thisWeek/ThisWeekList'
import { useThisWeekList } from '../hooks/useThisWeekList'
import { useCatalog } from '../hooks/useCatalog'
import { useStaticList } from '../hooks/useStaticList'
import { useDietFilterContext } from '../contexts/DietFilterContext'
import highFrequencySeed from '../firebase/seedData/highFrequency.json'
import lessFrequentSeed from '../firebase/seedData/lessFrequent.json'
import type { DietTags } from '../types/models'

export function ThisWeekScreen() {
  const { items, toggleChecked, removeItem, clearChecked } = useThisWeekList()
  const { items: catalogItems } = useCatalog()
  const highFrequency = useStaticList(highFrequencySeed)
  const lessFrequent = useStaticList(lessFrequentSeed)
  const { activeRestrictions } = useDietFilterContext()

  // "This Week" items can originate from any of the three source lists, so the
  // diet-tag lookup has to cover all three, not just the catalog.
  const dietTagsById = useMemo(() => {
    const map = new Map<string, DietTags | undefined>()
    for (const item of catalogItems) map.set(item.id, item.dietTags)
    for (const item of highFrequency) map.set(item.catalogItemId, item.dietTags)
    for (const item of lessFrequent) map.set(item.catalogItemId, item.dietTags)
    return map
  }, [catalogItems, highFrequency, lessFrequent])

  return (
    <ThisWeekList
      items={items}
      dietTagsById={dietTagsById}
      activeRestrictions={activeRestrictions}
      onToggleChecked={toggleChecked}
      onRemove={removeItem}
      onClearChecked={clearChecked}
    />
  )
}
