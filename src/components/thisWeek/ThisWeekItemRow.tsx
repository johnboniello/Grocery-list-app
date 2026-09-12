import { computeCompliance } from '../../utils/dietCompliance'
import type { DietRestriction, DietTags, ThisWeekItem } from '../../types/models'
import './ThisWeekItemRow.css'

interface Props {
  item: ThisWeekItem
  dietTags: DietTags | undefined
  activeRestrictions: DietRestriction[]
  onToggleChecked: () => void
  onRemove: () => void
}

export function ThisWeekItemRow({ item, dietTags, activeRestrictions, onToggleChecked, onRemove }: Props) {
  const status = computeCompliance(dietTags, activeRestrictions)

  return (
    <div
      className={`this-week-row this-week-row--${status}${item.checked ? ' this-week-row--checked' : ''}`}
    >
      <label className="this-week-row__main">
        <input type="checkbox" checked={item.checked} onChange={onToggleChecked} />
        <span className="this-week-row__name">{item.name}</span>
      </label>
      <button
        type="button"
        className="this-week-row__remove"
        aria-label={`Remove ${item.name}`}
        onClick={onRemove}
      >
        ×
      </button>
    </div>
  )
}
