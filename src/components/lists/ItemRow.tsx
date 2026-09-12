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
            ✎
          </button>
        )}
      </div>
      {editing && onEditTags && (
        <DietTagEditor dietTags={dietTags} onChange={onEditTags} />
      )}
    </div>
  )
}
