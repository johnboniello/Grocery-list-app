import { useMemo } from 'react'
import { ThisWeekItemRow } from './ThisWeekItemRow'
import { SortToggle } from '../lists/SortToggle'
import { useSortMode } from '../../hooks/useSortMode'
import { groupByCategory, sortAlphabetical } from '../../utils/groupByCategory'
import type { CountsPatch } from '../../utils/thisWeekCounts'
import type { Category, DietRestriction, DietTags, ThisWeekItem } from '../../types/models'
import './ThisWeekList.css'

interface Props {
  items: ThisWeekItem[]
  dietTagsById: Map<string, DietTags | undefined>
  categoryById: Map<string, Category | undefined>
  activeRestrictions: DietRestriction[]
  onToggleChecked: (catalogItemId: string) => void
  onSetNote: (catalogItemId: string, note: string) => void
  onSetCounts: (catalogItemId: string, patch: CountsPatch) => void
  onRemove: (catalogItemId: string) => void
  onClearChecked: () => void
}

export function ThisWeekList({
  items,
  dietTagsById,
  categoryById,
  activeRestrictions,
  onToggleChecked,
  onSetNote,
  onSetCounts,
  onRemove,
  onClearChecked,
}: Props) {
  const [sortMode, setSortMode] = useSortMode()
  const checkedCount = items.filter((item) => item.checked).length

  const groups = useMemo(
    () =>
      sortMode === 'category'
        ? groupByCategory(items, (i) => categoryById.get(i.catalogItemId), (i) => i.name)
        : sortAlphabetical(items, (i) => i.name),
    [items, sortMode, categoryById],
  )

  if (items.length === 0) {
    return (
      <p className="this-week-list__empty">
        Nothing on this week's list yet — tap items from the other tabs to add them.
      </p>
    )
  }

  return (
    <div className="this-week-list">
      <div className="this-week-list__header">
        <span>
          {items.length} item{items.length === 1 ? '' : 's'}
        </span>
        {checkedCount > 0 && (
          <button type="button" className="this-week-list__clear" onClick={onClearChecked}>
            Clear checked ({checkedCount})
          </button>
        )}
      </div>
      <SortToggle value={sortMode} onChange={setSortMode} />
      {groups.map((group) => (
        <div key={group.key} className="this-week-list__group">
          {sortMode === 'category' && <h4 className="this-week-list__group-label">{group.label}</h4>}
          {group.items.map((item) => (
            <ThisWeekItemRow
              key={item.catalogItemId}
              item={item}
              dietTags={dietTagsById.get(item.catalogItemId)}
              activeRestrictions={activeRestrictions}
              onToggleChecked={() => onToggleChecked(item.catalogItemId)}
              onSetNote={(note) => onSetNote(item.catalogItemId, note)}
              onSetCounts={(patch) => onSetCounts(item.catalogItemId, patch)}
              onRemove={() => onRemove(item.catalogItemId)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
