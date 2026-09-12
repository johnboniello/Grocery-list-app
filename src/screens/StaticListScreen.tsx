import { ItemListView } from '../components/lists/ItemListView'
import { useStaticList } from '../hooks/useStaticList'
import { useThisWeekList } from '../hooks/useThisWeekList'
import { useHousehold } from '../contexts/HouseholdContext'
import { updateStaticListItemTags, type StaticListName } from '../firebase/lists'
import { useDietFilterContext } from '../contexts/DietFilterContext'
import type { DietTags } from '../types/models'

interface Props {
  listName: StaticListName
}

/** Shared screen for the High Frequency and Less Frequent tabs — identical behavior, different Firestore collection. */
export function StaticListScreen({ listName }: Props) {
  const { householdId } = useHousehold()
  const rows = useStaticList(listName)
  const { addItem, addedIds } = useThisWeekList()
  const { activeRestrictions } = useDietFilterContext()

  const handleEditTags = (itemId: string, dietTags: DietTags) => {
    if (!householdId) return
    updateStaticListItemTags(householdId, listName, itemId, dietTags).catch((err: unknown) =>
      console.error('Failed to update tags', err),
    )
  }

  return (
    <ItemListView
      rows={rows}
      activeRestrictions={activeRestrictions}
      addedIds={addedIds}
      onAdd={(id, name) => addItem(id, name, listName)}
      onEditTags={handleEditTags}
    />
  )
}
