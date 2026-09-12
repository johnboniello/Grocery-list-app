import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useHousehold } from '../contexts/HouseholdContext'
import { createShareCode, revokeShareCode } from '../firebase/pairing'
import { leaveHousehold, resyncCatalogFromSeed, revokeMember } from '../firebase/household'
import './SettingsScreen.css'

export function SettingsScreen() {
  const { uid } = useAuth()
  const { householdId, memberUids } = useHousehold()
  const [shareCode, setShareCode] = useState<{ code: string; expiresAt: Date } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!householdId || !uid) return
    setBusy(true)
    setError(null)
    try {
      const result = await createShareCode(householdId, uid)
      setShareCode(result)
    } catch (err) {
      console.error('Failed to generate share code', err)
      setError('Could not generate a code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleCancelCode = async () => {
    if (!shareCode) return
    await revokeShareCode(shareCode.code).catch((err: unknown) => console.error(err))
    setShareCode(null)
  }

  const handleLeave = async () => {
    if (!householdId || !uid) return
    if (!window.confirm('Leave this household? You will need a new invite code to rejoin.')) return
    await leaveHousehold(householdId, uid).catch((err: unknown) => console.error(err))
  }

  const handleRevoke = async (memberUid: string) => {
    if (!householdId) return
    if (!window.confirm('Remove this device from the household?')) return
    await revokeMember(householdId, memberUid).catch((err: unknown) => console.error(err))
  }

  const handleSyncCatalog = async () => {
    if (!householdId || !uid) return
    setSyncing(true)
    setSyncMessage(null)
    try {
      const changed = await resyncCatalogFromSeed(householdId, uid)
      setSyncMessage(changed > 0 ? `Updated ${changed} catalog item${changed === 1 ? '' : 's'}.` : 'Catalog is already up to date.')
    } catch (err) {
      console.error('Failed to sync catalog', err)
      setSyncMessage('Could not update the catalog. Please try again.')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="settings">
      <section className="settings__section">
        <h2 className="settings__heading">Invite your household</h2>
        {shareCode ? (
          <div className="settings__code-box">
            <span className="settings__code-value">{shareCode.code}</span>
            <p className="settings__code-expiry">
              Expires at {shareCode.expiresAt.toLocaleTimeString()} — one-time use
            </p>
            <button type="button" className="settings__btn" onClick={handleCancelCode}>
              Cancel code
            </button>
          </div>
        ) : (
          <button type="button" className="settings__btn settings__btn--primary" onClick={handleGenerate} disabled={busy}>
            Generate invite code
          </button>
        )}
        {error && <p className="settings__error">{error}</p>}
      </section>

      <section className="settings__section">
        <h2 className="settings__heading">Members ({memberUids.length})</h2>
        <ul className="settings__members">
          {memberUids.map((memberUid) => (
            <li key={memberUid} className="settings__member">
              <span>{memberUid === uid ? 'This device (you)' : `Device ${memberUid.slice(0, 6)}`}</span>
              {memberUid !== uid && (
                <button type="button" className="settings__revoke" onClick={() => handleRevoke(memberUid)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="settings__section">
        <h2 className="settings__heading">Catalog</h2>
        <button type="button" className="settings__btn" onClick={handleSyncCatalog} disabled={syncing}>
          {syncing ? 'Updating…' : 'Sync catalog updates'}
        </button>
        {syncMessage && <p className="settings__code-expiry">{syncMessage}</p>}
      </section>

      <section className="settings__section">
        <button type="button" className="settings__btn settings__btn--danger" onClick={handleLeave}>
          Leave household
        </button>
      </section>
    </div>
  )
}
