import { useMemo, useState } from 'react'
import { ItemListView } from '../components/lists/ItemListView'
import { CatalogSearchBar } from '../components/lists/CatalogSearchBar'
import { useCatalog } from '../hooks/useCatalog'
import { useThisWeekList } from '../hooks/useThisWeekList'
import { useDietFilterContext } from '../contexts/DietFilterContext'
import type { DietTags } from '../types/models'

export function CatalogScreen() {
  const [query, setQuery] = useState('')
  const { items, addCustomItem, updateDietTags } = useCatalog()
  const { addItem, addedIds } = useThisWeekList()
  const { activeRestrictions } = useDietFilterContext()

  const queryLower = query.trim().toLowerCase()
  const filtered = useMemo(
    () => (queryLower ? items.filter((item) => item.nameLower.includes(queryLower)) : items),
    [items, queryLower],
  )
  const exactMatchExists = useMemo(
    () => items.some((item) => item.nameLower === queryLower),
    [items, queryLower],
  )
  const rows = useMemo(
    () => filtered.map((item) => ({ catalogItemId: item.id, name: item.name, dietTags: item.dietTags })),
    [filtered],
  )

  const handleAddCustom = async (name: string, dietTags: DietTags | undefined) => {
    try {
      const item = await addCustomItem(name, dietTags)
      addItem(item.id, item.name, 'catalog')
    } catch (err) {
      console.error('Failed to add custom item', err)
    }
  }

  return (
    <div>
      <CatalogSearchBar
        query={query}
        onQueryChange={setQuery}
        showAddOption={!exactMatchExists}
        onAddCustom={handleAddCustom}
      />
      <ItemListView
        rows={rows}
        activeRestrictions={activeRestrictions}
        addedIds={addedIds}
        onAdd={(id, name) => addItem(id, name, 'catalog')}
        onEditTags={(id, tags) => updateDietTags(id, tags)}
        emptyMessage="No matching items — try adding it as a new item above."
      />
    </div>
  )
}
