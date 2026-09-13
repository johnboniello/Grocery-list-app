import { useState } from 'react'
import { DietTagEditor } from '../diet/DietTagEditor'
import { CategoryPicker } from './CategoryPicker'
import type { Category, DietTags } from '../../types/models'
import './CatalogSearchBar.css'

interface Props {
  query: string
  onQueryChange: (query: string) => void
  showAddOption: boolean
  onAddCustom: (name: string, dietTags: DietTags | undefined, category: Category | undefined) => void
}

export function CatalogSearchBar({ query, onQueryChange, showAddOption, onAddCustom }: Props) {
  const [addingTags, setAddingTags] = useState<DietTags>({})
  const [addingCategory, setAddingCategory] = useState<Category | undefined>(undefined)
  const [showTagForm, setShowTagForm] = useState(false)

  const handleAdd = () => {
    const tags = Object.keys(addingTags).length > 0 ? addingTags : undefined
    onAddCustom(query.trim(), tags, addingCategory)
    setAddingTags({})
    setAddingCategory(undefined)
    setShowTagForm(false)
    onQueryChange('')
  }

  return (
    <div className="catalog-search-bar">
      <input
        type="search"
        className="catalog-search-bar__input"
        placeholder="Search the catalog…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      {showAddOption && query.trim().length > 0 && (
        <div className="catalog-search-bar__add">
          <button type="button" className="catalog-search-bar__add-btn" onClick={handleAdd}>
            Add "{query.trim()}" as a new item
          </button>
          <p className="catalog-search-bar__category-label">Category (optional)</p>
          <CategoryPicker value={addingCategory} onChange={setAddingCategory} />
          <button
            type="button"
            className="catalog-search-bar__tag-toggle"
            onClick={() => setShowTagForm((v) => !v)}
          >
            {showTagForm ? 'Hide diet tags' : 'Set diet tags (optional)'}
          </button>
          {showTagForm && (
            <DietTagEditor dietTags={addingTags} onChange={setAddingTags} />
          )}
        </div>
      )}
    </div>
  )
}
