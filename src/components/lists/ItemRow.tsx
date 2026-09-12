import { useState } from 'react'
import { computeCompliance } from '../../utils/dietCompliance'
import { DietTagEditor } from '../diet/DietTagEditor'
import type { DietRestriction, DietTags } from '../../types/models'
import './ItemRow.css'

interface Props {
  name: string
  dietTags?: DietTags
  activeRestrictions: DietRestriction[]
  isAdded: boolean
  onAdd: () => void
  onEditTags?: (dietTags: DietTags) => void
}

export function ItemRow({ name, dietTags, activeRestrictions, isAdded, onAdd, onEditTags }: Props) {
  const [editing, setEditing] = useState(false)
  const status = computeCompliance(dietTags, activeRestrictions)

  return (
    <div className="item-row-wrapper">
      <div className={`item-row item-row--${status}`}>
        <button type="button" className="item-row__main" onClick={onAdd}>
          <span className="item-row__name">{name}</span>
          {isAdded && <span className="item-row__added">Added</span>}
        </button>
        {onEditTags && (
          <button
            type="button"
            className="item-row__edit"
            aria-label={`Edit diet tags for ${name}`}
            onClick={() => setEditing((v) => !v)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}
      </div>
      {editing && onEditTags && (
        <DietTagEditor dietTags={dietTags} onChange={onEditTags} />
      )}
    </div>
  )
}
