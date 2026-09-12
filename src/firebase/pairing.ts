import { arrayUnion, deleteDoc, doc, runTransaction, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import { db } from './config'

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // excludes 0/O/1/I/L to avoid ambiguity
const CODE_LENGTH = 6
const CODE_TTL_MINUTES = 20

function generateCode(): string {
  const bytes = new Uint32Array(CODE_LENGTH)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

export async function createShareCode(
  householdId: string,
  uid: string,
): Promise<{ code: string; expiresAt: Date }> {
  const code = generateCode()
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000)
  await setDoc(doc(db, 'shareCodes', code), {
    householdId,
    status: 'pending',
    createdBy: uid,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
    usedBy: null,
    usedAt: null,
  })
  return { code, expiresAt }
}

export async function revokeShareCode(code: string): Promise<void> {
  await deleteDoc(doc(db, 'shareCodes', code))
}

/**
 * Redeems a pairing code atomically: joins the household and marks the code used.
 *
 * The joining device is, by definition, not yet a household member — and the
 * household's `read` rule only allows existing members. So this must never
 * `get()` the household doc (that would be denied); it uses `arrayUnion` to
 * append itself blind, which the security rules can validate purely from the
 * write's own `resource.data` / `request.resource.data`, no read required.
 */
export async function redeemShareCode(rawCode: string, uid: string): Promise<string> {
  const code = rawCode.trim().toUpperCase()
  const codeRef = doc(db, 'shareCodes', code)

  return runTransaction(db, async (tx) => {
    const codeSnap = await tx.get(codeRef)
    if (!codeSnap.exists()) throw new Error('That code was not found.')
    const codeData = codeSnap.data()
    if (codeData.status !== 'pending') throw new Error('That code has already been used.')
    if ((codeData.expiresAt as Timestamp).toDate() < new Date()) {
      throw new Error('That code has expired.')
    }

    const householdId = codeData.householdId as string
    const householdRef = doc(db, 'households', householdId)

    tx.update(householdRef, {
      memberUids: arrayUnion(uid),
      lastRedeemedCode: code,
    })
    tx.update(codeRef, { status: 'used', usedBy: uid, usedAt: serverTimestamp() })
    tx.set(doc(db, 'users', uid), { householdId, updatedAt: serverTimestamp() })

    return householdId
  })
}
