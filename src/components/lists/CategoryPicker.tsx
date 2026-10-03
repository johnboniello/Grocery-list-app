import { useState } from 'react'
import { useCustomCategories } from '../../contexts/CategoriesContext'
import { CATEGORIES, categoryLabel, type Category } from '../../types/models'
import './CategoryPicker.css'

interface Props {
  value: Category | undefined
  onChange: (category: Category | undefined) => void
}

export function CategoryPicker({ value, onChange }: Props) {
  const customCategories = useCustomCategories()
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  // A just-made category isn't on any saved item yet (e.g. while adding a new item), so show it anyway.
  const options: Category[] = [...CATEGORIES, ...customCategories]
  if (value && !options.includes(value)) options.push(value)

  const commitNew = () => {
    const name = draft.trim()
    setDraft('')
    setAdding(false)
    if (!name) return
    // Typing an existing category's name (or a built-in's key, e.g. "dairy") picks that one instead.
    const lower = name.toLowerCase()
    const existing = options.find(
      (cat) => cat.toLowerCase() === lower || categoryLabel(cat).toLowerCase() === lower,
    )
    onChange(existing ?? name)
  }

  return (
    <div className="category-picker" role="group" aria-label="Category">
      {options.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`category-picker__chip${value === cat ? ' category-picker__chip--active' : ''}`}
          aria-pressed={value === cat}
          onClick={() => onChange(value === cat ? undefined : cat)}
        >
          {categoryLabel(cat)}
        </button>
      ))}
      {adding ? (
        <input
          type="text"
          className="category-picker__input"
          value={draft}
          maxLength={30}
          placeholder="New category, e.g. Deli"
          aria-label="New category name"
          enterKeyHint="done"
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitNew}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            else if (e.key === 'Escape') {
              setDraft('')
              setAdding(false)
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="category-picker__chip category-picker__chip--new"
          onClick={() => setAdding(true)}
        >
          + New category
        </button>
      )}
    </div>
  )
}
