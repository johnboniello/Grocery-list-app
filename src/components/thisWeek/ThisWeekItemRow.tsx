import { useRef, useState } from 'react'
import { computeCompliance } from '../../utils/dietCompliance'
import type { DietRestriction, DietTags, ThisWeekItem } from '../../types/models'
import './ThisWeekItemRow.css'

const NOTE_MAX_LENGTH = 80

interface Props {
  item: ThisWeekItem
  dietTags: DietTags | undefined
  activeRestrictions: DietRestriction[]
  onToggleChecked: () => void
  onSetNote: (note: string) => void
  onRemove: () => void
}

export function ThisWeekItemRow({ item, dietTags, activeRestrictions, onToggleChecked, onSetNote, onRemove }: Props) {
  const status = computeCompliance(dietTags, activeRestrictions)
  const [editingNote, setEditingNote] = useState(false)
  const [draft, setDraft] = useState('')
  // Enter/Escape close the editor themselves; this stops the blur that follows from saving a second time.
  const finished = useRef(false)

  const openNoteEditor = () => {
    finished.current = false
    setDraft(item.note ?? '')
    setEditingNote(true)
  }

  const closeNoteEditor = (save: boolean) => {
    if (finished.current) return
    finished.current = true
    if (save && draft.trim() !== (item.note ?? '')) onSetNote(draft)
    setEditingNote(false)
  }

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
        className="this-week-row__note-btn"
        aria-label={`${item.note ? 'Edit' : 'Add'} note for ${item.name}`}
        onClick={openNoteEditor}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
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
      {editingNote ? (
        <input
          type="text"
          className="this-week-row__note-input"
          value={draft}
          maxLength={NOTE_MAX_LENGTH}
          placeholder="e.g. chunky Skippy"
          aria-label={`Note for ${item.name}`}
          enterKeyHint="done"
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => closeNoteEditor(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') closeNoteEditor(true)
            else if (e.key === 'Escape') closeNoteEditor(false)
          }}
        />
      ) : (
        item.note && (
          <button type="button" className="this-week-row__note" onClick={openNoteEditor}>
            {item.note}
          </button>
        )
      )}
    </div>
  )
}
