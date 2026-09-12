import { ThisWeekItemRow } from './ThisWeekItemRow'
import type { DietRestriction, DietTags, ThisWeekItem } from '../../types/models'
import './ThisWeekList.css'

interface Props {
  items: ThisWeekItem[]
  dietTagsById: Map<string, DietTags | undefined>
  activeRestrictions: DietRestriction[]
  onToggleChecked: (catalogItemId: string) => void
  onRemove: (catalogItemId: string) => void
  onClearChecked: () => void
}

export function ThisWeekList({
  items,
  dietTagsById,
  activeRestrictions,
  onToggleChecked,
  onRemove,
  onClearChecked,
}: Props) {
  const checkedCount = items.filter((item) => item.checked).length

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
      {items.map((item) => (
        <ThisWeekItemRow
          key={item.catalogItemId}
          item={item}
          dietTags={dietTagsById.get(item.catalogItemId)}
          activeRestrictions={activeRestrictions}
          onToggleChecked={() => onToggleChecked(item.catalogItemId)}
          onRemove={() => onRemove(item.catalogItemId)}
        />
      ))}
    </div>
  )
}
