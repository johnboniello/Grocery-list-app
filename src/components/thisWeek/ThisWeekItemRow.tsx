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
        <span className="this-week-row__checkbox">
          <input
            type="checkbox"
            className="this-week-row__checkbox-input"
            checked={item.checked}
            onChange={onToggleChecked}
          />
          <span
            className={`this-week-row__checkbox-visual${item.checked ? ' this-week-row__checkbox-visual--on' : ''}`}
          >
            {item.checked && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </span>
        </span>
        <span className="this-week-row__name">{item.name}</span>
      </label>
      <button
        type="button"
        className="this-week-row__remove"
        aria-label={`Remove ${item.name}`}
        onClick={onRemove}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}
