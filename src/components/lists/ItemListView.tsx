import { useMemo } from 'react'
import { ItemRow } from './ItemRow'
import { SortToggle } from './SortToggle'
import { useSortMode } from '../../hooks/useSortMode'
import { groupByCategory, sortAlphabetical } from '../../utils/groupByCategory'
import type { Category, DietRestriction, DietTags } from '../../types/models'
import './ItemListView.css'

export interface ListRow {
  catalogItemId: string
  name: string
  dietTags?: DietTags
  category?: Category
}

interface Props {
  rows: ListRow[]
  activeRestrictions: DietRestriction[]
  addedIds: Set<string>
  onAdd: (catalogItemId: string, name: string) => void
  onEditTags?: (catalogItemId: string, dietTags: DietTags) => void
  emptyMessage?: string
}

export function ItemListView({ rows, activeRestrictions, addedIds, onAdd, onEditTags, emptyMessage }: Props) {
  const [sortMode, setSortMode] = useSortMode()

  const groups = useMemo(
    () =>
      sortMode === 'category'
        ? groupByCategory(rows, (r) => r.category, (r) => r.name)
        : sortAlphabetical(rows, (r) => r.name),
    [rows, sortMode],
  )

  if (rows.length === 0) {
    return <p className="item-list-view__empty">{emptyMessage ?? 'No items.'}</p>
  }

  return (
    <div className="item-list-view">
      <SortToggle value={sortMode} onChange={setSortMode} />
      {groups.map((group) => (
        <div key={group.key} className="item-list-view__group">
          {sortMode === 'category' && <h4 className="item-list-view__group-label">{group.label}</h4>}
          {group.items.map((row) => (
            <ItemRow
              key={row.catalogItemId}
              name={row.name}
              dietTags={row.dietTags}
              activeRestrictions={activeRestrictions}
              isAdded={addedIds.has(row.catalogItemId)}
              onAdd={() => onAdd(row.catalogItemId, row.name)}
              onEditTags={onEditTags ? (tags) => onEditTags(row.catalogItemId, tags) : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
