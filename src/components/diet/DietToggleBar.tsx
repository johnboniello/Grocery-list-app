import { DIET_LABELS, DIET_RESTRICTIONS, type DietRestriction } from '../../types/models'
import './DietToggleBar.css'

interface Props {
  activeRestrictions: DietRestriction[]
  onToggle: (restriction: DietRestriction) => void
}

export function DietToggleBar({ activeRestrictions, onToggle }: Props) {
  return (
    <div className="diet-toggle-bar" role="group" aria-label="Diet filters">
      {DIET_RESTRICTIONS.map((restriction) => {
        const isActive = activeRestrictions.includes(restriction)
        return (
          <button
            key={restriction}
            type="button"
            className={`diet-toggle${isActive ? ' diet-toggle--active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onToggle(restriction)}
          >
            {DIET_LABELS[restriction]}
          </button>
        )
      })}
    </div>
  )
}
