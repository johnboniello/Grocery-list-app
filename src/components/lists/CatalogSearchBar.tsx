import { useState } from 'react'
import { DietTagEditor } from '../diet/DietTagEditor'
import type { DietTags } from '../../types/models'
import './CatalogSearchBar.css'

interface Props {
  query: string
  onQueryChange: (query: string) => void
  showAddOption: boolean
  onAddCustom: (name: string, dietTags: DietTags | undefined) => void
}

export function CatalogSearchBar({ query, onQueryChange, showAddOption, onAddCustom }: Props) {
  const [addingTags, setAddingTags] = useState<DietTags>({})
  const [showTagForm, setShowTagForm] = useState(false)

  const handleAdd = () => {
    const tags = Object.keys(addingTags).length > 0 ? addingTags : undefined
    onAddCustom(query.trim(), tags)
    setAddingTags({})
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
