import { CATEGORIES, CATEGORY_LABELS, type Category } from '../../types/models'
import './CategoryPicker.css'

interface Props {
  value: Category | undefined
  onChange: (category: Category | undefined) => void
}

export function CategoryPicker({ value, onChange }: Props) {
  return (
    <div className="category-picker" role="group" aria-label="Category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`category-picker__chip${value === cat ? ' category-picker__chip--active' : ''}`}
          aria-pressed={value === cat}
          onClick={() => onChange(value === cat ? undefined : cat)}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  )
}
