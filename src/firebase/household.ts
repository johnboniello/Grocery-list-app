import { arrayRemove, collection, doc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { db } from './config'
import highFrequencySeed from './seedData/highFrequency.json'
import lessFrequentSeed from './seedData/lessFrequent.json'
import catalogSeed from './seedData/catalog.json'
import type { Category, DietTags } from '../types/models'

interface SeedRow {
  id: string
  name: string
  dietTags?: DietTags
  category?: Category
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
      ...(item.category ? { category: item.category } : {}),
    })
  }
  for (const item of highFrequencySeed as SeedRow[]) {
    batch.set(doc(db, 'households', householdId, 'highFrequency', item.id), {
      catalogItemId: item.id,
      name: item.name,
      addedBy: uid,
      addedAt: serverTimestamp(),
      ...(item.dietTags ? { dietTags: item.dietTags } : {}),
      ...(item.category ? { category: item.category } : {}),
    })
  }
  for (const item of lessFrequentSeed as SeedRow[]) {
    batch.set(doc(db, 'households', householdId, 'lessFrequent', item.id), {
      catalogItemId: item.id,
      name: item.name,
      addedBy: uid,
      addedAt: serverTimestamp(),
      ...(item.dietTags ? { dietTags: item.dietTags } : {}),
      ...(item.category ? { category: item.category } : {}),
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

function tagsDiffer(a: DietTags | undefined, b: DietTags | undefined): boolean {
  return JSON.stringify(a ?? {}) !== JSON.stringify(b ?? {})
}

/**
 * Adds any seed items a collection doesn't already have, and refreshes the diet tags
 * and category of items it already has to match the current template — so corrections
 * to the bundled data (e.g. a fixed diet-tag mistake, or newly added categories) reach
 * households that were already seeded.
 *
 * For the catalog, only docs with source 'seed' are touched — a member's own custom
 * items are never overwritten, since their id will not match a seed id anyway, but the
 * source check is a second guard against ever clobbering a hand-tagged item. For
 * highFrequency/lessFrequent there is no in-app way to add items other than seeding, so
 * every doc there is always seed-sourced and safe to refresh unconditionally.
 */
function syncCollection(
  batch: ReturnType<typeof writeBatch>,
  householdId: string,
  collectionName: 'catalog' | 'highFrequency' | 'lessFrequent',
  seed: SeedRow[],
  existingById: Map<string, Record<string, unknown>>,
  uid: string,
): number {
  let changed = 0
  for (const item of seed) {
    const current = existingById.get(item.id)
    if (!current) {
      const base =
        collectionName === 'catalog'
          ? { name: item.name, nameLower: item.name.toLowerCase(), source: 'seed' as const }
          : { catalogItemId: item.id, name: item.name, addedBy: uid, addedAt: serverTimestamp() }
      batch.set(doc(db, 'households', householdId, collectionName, item.id), {
        ...base,
        ...(collectionName === 'catalog' ? { createdBy: uid, createdAt: serverTimestamp() } : {}),
        ...(item.dietTags ? { dietTags: item.dietTags } : {}),
        ...(item.category ? { category: item.category } : {}),
      })
      changed++
      continue
    }
    if (collectionName === 'catalog' && current.source !== 'seed') continue
    const dietTagsChanged = tagsDiffer(current.dietTags as DietTags | undefined, item.dietTags)
    const categoryChanged = (current.category ?? undefined) !== (item.category ?? undefined)
    if (dietTagsChanged || categoryChanged) {
      batch.set(
        doc(db, 'households', householdId, collectionName, item.id),
        { dietTags: item.dietTags ?? {}, ...(item.category ? { category: item.category } : {}) },
        { merge: true },
      )
      changed++
    }
  }
  return changed
}

export async function resyncFromSeed(householdId: string, uid: string): Promise<number> {
  const [catalogDocs, highFrequencyDocs, lessFrequentDocs] = await Promise.all([
    getDocs(collection(db, 'households', householdId, 'catalog')),
    getDocs(collection(db, 'households', householdId, 'highFrequency')),
    getDocs(collection(db, 'households', householdId, 'lessFrequent')),
  ])

  const batch = writeBatch(db)
  let changed = 0
  changed += syncCollection(
    batch,
    householdId,
    'catalog',
    catalogSeed as SeedRow[],
    new Map(catalogDocs.docs.map((d) => [d.id, d.data()])),
    uid,
  )
  changed += syncCollection(
    batch,
    householdId,
    'highFrequency',
    highFrequencySeed as SeedRow[],
    new Map(highFrequencyDocs.docs.map((d) => [d.id, d.data()])),
    uid,
  )
  changed += syncCollection(
    batch,
    householdId,
    'lessFrequent',
    lessFrequentSeed as SeedRow[],
    new Map(lessFrequentDocs.docs.map((d) => [d.id, d.data()])),
    uid,
  )
  if (changed > 0) await batch.commit()
  return changed
}
