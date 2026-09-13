import type { SortMode } from '../../hooks/useSortMode'
import './SortToggle.css'

interface Props {
  value: SortMode
  onChange: (mode: SortMode) => void
}

export function SortToggle({ value, onChange }: Props) {
  return (
    <div className="sort-toggle" role="group" aria-label="Sort order">
      <button
        type="button"
        className={`sort-toggle__btn${value === 'alphabetical' ? ' sort-toggle__btn--active' : ''}`}
        aria-pressed={value === 'alphabetical'}
        onClick={() => onChange('alphabetical')}
      >
        A–Z
      </button>
      <button
        type="button"
        className={`sort-toggle__btn${value === 'category' ? ' sort-toggle__btn--active' : ''}`}
        aria-pressed={value === 'category'}
        onClick={() => onChange('category')}
      >
        Category
      </button>
    </div>
  )
}
