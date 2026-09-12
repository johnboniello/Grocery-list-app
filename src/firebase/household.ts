import { arrayRemove, collection, doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { db } from './config'
import highFrequencySeed from './seedData/highFrequency.json'
import lessFrequentSeed from './seedData/lessFrequent.json'
import catalogSeed from './seedData/catalog.json'
import type { DietTags } from '../types/models'

interface SeedRow {
  id: string
  name: string
  dietTags?: DietTags
}

/**
 * Creates a household owned by `uid`, then seeds its three item lists from the
 * bundled templates. This is deliberately two sequential writes, not one
 * batch: the security rules for the subcollections check membership via
 * `get()` on the household doc, and `get()` inside rules only ever sees the
 * database state from *before* the current batch/transaction — so a household
 * doc created in the same batch as its own subcollection writes would not yet
 * be visible to those writes' rule checks, and every seed write would be denied.
 */
export async function createHousehold(uid: string): Promise<string> {
  const householdRef = doc(collection(db, 'households'))
  const householdId = householdRef.id

  await setDoc(householdRef, {
    memberUids: [uid],
    lastRedeemedCode: null,
    createdAt: serverTimestamp(),
  })

  const batch = writeBatch(db)

  for (const item of catalogSeed as SeedRow[]) {
    batch.set(doc(db, 'households', householdId, 'catalog', item.id), {
      name: item.name,
      nameLower: item.name.toLowerCase(),
      source: 'seed',
      createdBy: uid,
      createdAt: serverTimestamp(),
      ...(item.dietTags ? { dietTags: item.dietTags } : {}),
    })
  }
  for (const item of highFrequencySeed as SeedRow[]) {
    batch.set(doc(db, 'households', householdId, 'highFrequency', item.id), {
      catalogItemId: item.id,
      name: item.name,
      addedBy: uid,
      addedAt: serverTimestamp(),
      ...(item.dietTags ? { dietTags: item.dietTags } : {}),
    })
  }
  for (const item of lessFrequentSeed as SeedRow[]) {
    batch.set(doc(db, 'households', householdId, 'lessFrequent', item.id), {
      catalogItemId: item.id,
      name: item.name,
      addedBy: uid,
      addedAt: serverTimestamp(),
      ...(item.dietTags ? { dietTags: item.dietTags } : {}),
    })
  }

  batch.set(doc(db, 'users', uid), { householdId, updatedAt: serverTimestamp() })

  await batch.commit()
  return householdId
}

export async function leaveHousehold(householdId: string, uid: string): Promise<void> {
  const batch = writeBatch(db)
  batch.update(doc(db, 'households', householdId), { memberUids: arrayRemove(uid) })
  batch.set(doc(db, 'users', uid), { householdId: null, updatedAt: serverTimestamp() })
  await batch.commit()
}

/** Removes a (possibly different, e.g. lost-phone) device from the household. */
export async function revokeMember(householdId: string, memberUid: string): Promise<void> {
  await setDoc(
    doc(db, 'households', householdId),
    { memberUids: arrayRemove(memberUid) },
    { merge: true },
  )
}

/** Called by a device that discovers it's been revoked, so it can get back to Onboarding. */
export async function clearOwnHouseholdPointer(uid: string): Promise<void> {
  await setDoc(doc(db, 'users', uid), { householdId: null, updatedAt: serverTimestamp() })
}
