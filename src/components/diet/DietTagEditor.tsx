import { DIET_LABELS, DIET_RESTRICTIONS, type DietRestriction, type DietTags } from '../../types/models'
import './DietTagEditor.css'

interface Props {
  dietTags: DietTags | undefined
  onChange: (dietTags: DietTags) => void
}

/** Three explicit states per restriction: not tagged, meets it, fails it. */
export function DietTagEditor({ dietTags, onChange }: Props) {
  const setValue = (restriction: DietRestriction, value: boolean | undefined) => {
    const next = { ...dietTags }
    if (value === undefined) {
      delete next[restriction]
    } else {
      next[restriction] = value
    }
    onChange(next)
  }

  return (
    <div className="diet-tag-editor">
      {DIET_RESTRICTIONS.map((restriction) => {
        const value = dietTags?.[restriction]
        return (
          <div key={restriction} className="diet-tag-editor__row">
            <span className="diet-tag-editor__label">{DIET_LABELS[restriction]}</span>
            <div className="diet-tag-editor__controls">
              <button
                type="button"
                className={`diet-tag-editor__btn${value === undefined ? ' diet-tag-editor__btn--selected' : ''}`}
                onClick={() => setValue(restriction, undefined)}
              >
                Not tagged
              </button>
              <button
                type="button"
                className={`diet-tag-editor__btn diet-tag-editor__btn--pass${value === true ? ' diet-tag-editor__btn--selected' : ''}`}
                onClick={() => setValue(restriction, true)}
              >
                Meets
              </button>
              <button
                type="button"
                className={`diet-tag-editor__btn diet-tag-editor__btn--fail${value === false ? ' diet-tag-editor__btn--selected' : ''}`}
                onClick={() => setValue(restriction, false)}
              >
                Fails
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
