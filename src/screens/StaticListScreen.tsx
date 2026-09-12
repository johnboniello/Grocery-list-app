import { ItemListView } from '../components/lists/ItemListView'
import { useStaticList } from '../hooks/useStaticList'
import { useThisWeekList } from '../hooks/useThisWeekList'
import { useTagOverrides } from '../hooks/useTagOverrides'
import { useDietFilterContext } from '../contexts/DietFilterContext'
import type { DietTags, SourceList } from '../types/models'

interface SeedRow {
  id: string
  name: string
  dietTags?: DietTags
}

interface Props {
  seedRows: SeedRow[]
  sourceList: SourceList
}

/** Shared screen for the High Frequency and Less Frequent tabs — identical behavior, different seed data. */
export function StaticListScreen({ seedRows, sourceList }: Props) {
  const rows = useStaticList(seedRows)
  const { addItem, addedIds } = useThisWeekList()
  const { setOverride } = useTagOverrides()
  const { activeRestrictions } = useDietFilterContext()

  return (
    <ItemListView
      rows={rows}
      activeRestrictions={activeRestrictions}
      addedIds={addedIds}
      onAdd={(id, name) => addItem(id, name, sourceList)}
      onEditTags={(id, tags) => setOverride(id, tags)}
    />
  )
}
