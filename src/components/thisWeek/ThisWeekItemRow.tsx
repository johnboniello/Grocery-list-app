import { useRef, useState } from 'react'
import { computeCompliance } from '../../utils/dietCompliance'
import { MAX_QUANTITY, type CountsPatch } from '../../utils/thisWeekCounts'
import type { DietRestriction, DietTags, ThisWeekItem } from '../../types/models'
import './ThisWeekItemRow.css'

const NOTE_MAX_LENGTH = 80

interface Props {
  item: ThisWeekItem
  dietTags: DietTags | undefined
  activeRestrictions: DietRestriction[]
  onToggleChecked: () => void
  onSetNote: (note: string) => void
  onSetCounts: (patch: CountsPatch) => void
  onRemove: () => void
}

interface StepperProps {
  label: string
  itemName: string
  value: number
  min: number
  max: number
  suffix?: string
  onChange: (value: number) => void
}

function Stepper({ label, itemName, value, min, max, suffix, onChange }: StepperProps) {
  return (
    <div className="this-week-row__stepper">
      <span className="this-week-row__stepper-label">{label}</span>
      <button
        type="button"
        className="this-week-row__stepper-btn"
        aria-label={`Decrease ${label.toLowerCase()} for ${itemName}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span className="this-week-row__stepper-value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="this-week-row__stepper-btn"
        aria-label={`Increase ${label.toLowerCase()} for ${itemName}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
      {suffix && <span className="this-week-row__stepper-suffix">{suffix}</span>}
    </div>
  )
}

export function ThisWeekItemRow({ item, dietTags, activeRestrictions, onToggleChecked, onSetNote, onSetCounts, onRemove }: Props) {
  const status = computeCompliance(dietTags, activeRestrictions)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  // What the note currently is on the server, so a blur right after Enter doesn't save the same text twice.
  const lastSaved = useRef('')
  // Set while closing so the blur caused by Escape (or by unmounting) can't save a discarded draft.
  const closing = useRef(false)

  const quantity = item.quantity ?? 1
  const found = item.found ?? 0
  const partial = quantity > 1 && found > 0 && found < quantity

  const openPanel = () => {
    closing.current = false
    lastSaved.current = item.note ?? ''
    setDraft(item.note ?? '')
    setOpen(true)
  }

  const commitNote = () => {
    if (closing.current) return
    if (draft.trim() === lastSaved.current) return
    lastSaved.current = draft.trim()
    onSetNote(draft)
  }

  const closePanel = (save: boolean) => {
    if (save) commitNote()
    closing.current = true
    setOpen(false)
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
        {quantity > 1 && (
          <span className={`this-week-row__qty${partial ? ' this-week-row__qty--partial' : ''}`}>
            {partial ? `${found} of ${quantity}` : `×${quantity}`}
          </span>
        )}
      </label>
      <button
        type="button"
        className="this-week-row__note-btn"
        aria-label={`Edit note or quantity for ${item.name}`}
        aria-expanded={open}
        onClick={() => (open ? closePanel(true) : openPanel())}
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
      {open ? (
        <div className="this-week-row__panel">
          <Stepper
            label="Quantity"
            itemName={item.name}
            value={quantity}
            min={1}
            max={MAX_QUANTITY}
            onChange={(value) => onSetCounts({ quantity: value })}
          />
          {quantity > 1 && (
            <Stepper
              label="Found"
              itemName={item.name}
              value={found}
              min={0}
              max={quantity}
              suffix={`of ${quantity}`}
              onChange={(value) => onSetCounts({ found: value })}
            />
          )}
          <input
            type="text"
            className="this-week-row__note-input"
            value={draft}
            maxLength={NOTE_MAX_LENGTH}
            placeholder="Note, e.g. chunky Skippy"
            aria-label={`Note for ${item.name}`}
            enterKeyHint="done"
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitNote}
            onKeyDown={(e) => {
              if (e.key === 'Enter') closePanel(true)
              else if (e.key === 'Escape') closePanel(false)
            }}
          />
          <button type="button" className="this-week-row__done" onClick={() => closePanel(true)}>
            Done
          </button>
        </div>
      ) : (
        item.note && (
          <button type="button" className="this-week-row__note" onClick={openPanel}>
            {item.note}
          </button>
        )
      )}
    </div>
  )
}
