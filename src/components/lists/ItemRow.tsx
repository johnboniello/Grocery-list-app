import { useId, useState } from 'react'
import { computeCompliance } from '../../utils/dietCompliance'
import { DietTagEditor } from '../diet/DietTagEditor'
import { CategoryPicker } from './CategoryPicker'
import type { Category, DietRestriction, DietTags } from '../../types/models'
import './ItemRow.css'

interface Props {
  name: string
  dietTags?: DietTags
  category?: Category
  activeRestrictions: DietRestriction[]
  isAdded: boolean
  onAdd: () => void
  onEditTags?: (dietTags: DietTags) => void
  onEditCategory?: (category: Category | undefined) => void
  onRename?: (name: string) => void
  onDelete?: () => void
}

export function ItemRow({
  name,
  dietTags,
  category,
  activeRestrictions,
  isAdded,
  onAdd,
  onEditTags,
  onEditCategory,
  onRename,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [nameDraft, setNameDraft] = useState(name)
  const nameInputId = useId()
  const status = computeCompliance(dietTags, activeRestrictions)
  const canEdit = Boolean(onEditTags || onEditCategory || onRename || onDelete)

  const toggleEditing = () => {
    if (!editing) setNameDraft(name)
    setEditing((v) => !v)
  }

  const commitName = () => {
    const trimmed = nameDraft.trim()
    if (!trimmed) setNameDraft(name)
    else if (trimmed !== name) onRename?.(trimmed)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${name}"? It will also come off this week's list.`)) onDelete?.()
  }

  return (
    <div className="item-row-wrapper">
      <div className={`item-row item-row--${status}`}>
        <button type="button" className="item-row__main" onClick={onAdd}>
          <span className="item-row__name">{name}</span>
          {isAdded && <span className="item-row__added">Added</span>}
        </button>
        {canEdit && (
          <button
            type="button"
            className="item-row__edit"
            aria-label={`Edit ${name}`}
            aria-expanded={editing}
            onClick={toggleEditing}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}
      </div>
      {editing && onRename && (
        <div className="item-row__section">
          <label className="item-row__section-label" htmlFor={nameInputId}>
            Name
          </label>
          <input
            id={nameInputId}
            type="text"
            className="item-row__name-input"
            value={nameDraft}
            enterKeyHint="done"
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
              else if (e.key === 'Escape') setNameDraft(name)
            }}
          />
        </div>
      )}
      {editing && onEditCategory && (
        <div className="item-row__section">
          <p className="item-row__section-label">Category</p>
          <CategoryPicker value={category} onChange={onEditCategory} />
        </div>
      )}
      {editing && onEditTags && <DietTagEditor dietTags={dietTags} onChange={onEditTags} />}
      {editing && onDelete && (
        <button type="button" className="item-row__delete" onClick={handleDelete}>
          Delete item
        </button>
      )}
    </div>
  )
}
