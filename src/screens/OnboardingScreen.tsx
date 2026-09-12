import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createHousehold } from '../firebase/household'
import { redeemShareCode } from '../firebase/pairing'
import './OnboardingScreen.css'

export function OnboardingScreen() {
  const { uid } = useAuth()
  const [mode, setMode] = useState<'choose' | 'join'>('choose')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleCreate = async () => {
    if (!uid) return
    setBusy(true)
    setError(null)
    try {
      await createHousehold(uid)
    } catch (err) {
      console.error('Failed to create household', err)
      setError('Could not create a household. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleJoin = async () => {
    if (!uid || !code.trim()) return
    setBusy(true)
    setError(null)
    try {
      await redeemShareCode(code, uid)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join that household.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding__logo">
        <svg width="30" height="30" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="#c9713f" />
          <path
            d="M32 52 L44 64 L70 36"
            fill="none"
            stroke="#fdf9f0"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>
      <h1 className="onboarding__title">Grocery List</h1>
      <p className="onboarding__intro">
        No account or email needed — just create a household, or join one with a code from your
        partner.
      </p>

      {mode === 'choose' && (
        <div className="onboarding__actions">
          <button type="button" className="onboarding__btn onboarding__btn--primary" onClick={handleCreate} disabled={busy}>
            Create a household
          </button>
          <button type="button" className="onboarding__btn" onClick={() => setMode('join')} disabled={busy}>
            Join with a code
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div className="onboarding__actions">
          <input
            type="text"
            className="onboarding__code-input"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            autoFocus
          />
          <button
            type="button"
            className="onboarding__btn onboarding__btn--primary"
            onClick={handleJoin}
            disabled={busy || !code.trim()}
          >
            Join household
          </button>
          <button type="button" className="onboarding__btn" onClick={() => setMode('choose')} disabled={busy}>
            Back
          </button>
        </div>
      )}

      {error && <p className="onboarding__error">{error}</p>}
    </div>
  )
}
