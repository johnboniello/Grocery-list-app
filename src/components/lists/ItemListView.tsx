import { ItemRow } from './ItemRow'
import type { DietRestriction, DietTags } from '../../types/models'
import './ItemListView.css'

export interface ListRow {
  catalogItemId: string
  name: string
  dietTags?: DietTags
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
  if (rows.length === 0) {
    return <p className="item-list-view__empty">{emptyMessage ?? 'No items.'}</p>
  }

  return (
    <div className="item-list-view">
      {rows.map((row) => (
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
  )
}
