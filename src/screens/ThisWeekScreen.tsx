import { useMemo } from 'react'
import { ThisWeekList } from '../components/thisWeek/ThisWeekList'
import { useThisWeekList } from '../hooks/useThisWeekList'
import { useCatalog } from '../hooks/useCatalog'
import { useStaticList } from '../hooks/useStaticList'
import { useDietFilterContext } from '../contexts/DietFilterContext'
import type { Category, DietTags } from '../types/models'

export function ThisWeekScreen() {
  const { items, toggleChecked, setNote, setCounts, removeItem, clearChecked } = useThisWeekList()
  const { items: catalogItems } = useCatalog()
  const highFrequency = useStaticList('highFrequency')
  const lessFrequent = useStaticList('lessFrequent')
  const { activeRestrictions } = useDietFilterContext()

  // "This Week" items can originate from any of the three source lists, so the
  // diet-tag and category lookups have to cover all three, not just the catalog.
  const dietTagsById = useMemo(() => {
    const map = new Map<string, DietTags | undefined>()
    for (const item of catalogItems) map.set(item.id, item.dietTags)
    for (const item of highFrequency) map.set(item.catalogItemId, item.dietTags)
    for (const item of lessFrequent) map.set(item.catalogItemId, item.dietTags)
    return map
  }, [catalogItems, highFrequency, lessFrequent])

  const categoryById = useMemo(() => {
    const map = new Map<string, Category | undefined>()
    for (const item of catalogItems) map.set(item.id, item.category)
    for (const item of highFrequency) map.set(item.catalogItemId, item.category)
    for (const item of lessFrequent) map.set(item.catalogItemId, item.category)
    return map
  }, [catalogItems, highFrequency, lessFrequent])

  return (
    <ThisWeekList
      items={items}
      dietTagsById={dietTagsById}
      categoryById={categoryById}
      activeRestrictions={activeRestrictions}
      onToggleChecked={toggleChecked}
      onSetNote={setNote}
      onSetCounts={setCounts}
      onRemove={removeItem}
      onClearChecked={clearChecked}
    />
  )
}
