import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import type { SourceList, ThisWeekItem } from '../types/models'

function thisWeekCollection(householdId: string) {
  return collection(db, 'households', householdId, 'thisWeek')
}

export function subscribeToThisWeek(
  householdId: string,
  onItems: (items: ThisWeekItem[]) => void,
  onError: (error: Error) => void,
): () => void {
  const q = query(thisWeekCollection(householdId), orderBy('addedAt'))
  return onSnapshot(
    q,
    (snapshot) => {
      onItems(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            catalogItemId: d.id,
            name: data.name,
            sourceList: data.sourceList,
            checked: data.checked,
            addedAt: (data.addedAt as Timestamp | undefined)?.toMillis() ?? Date.now(),
            checkedAt: (data.checkedAt as Timestamp | undefined)?.toMillis(),
            note: data.note,
            quantity: data.quantity,
            found: data.found,
          } as ThisWeekItem
        }),
      )
    },
    onError,
  )
}

export async function addThisWeekItem(
  householdId: string,
  uid: string,
  catalogItemId: string,
  name: string,
  sourceList: SourceList,
): Promise<void> {
  await setDoc(doc(db, 'households', householdId, 'thisWeek', catalogItemId), {
    catalogItemId,
    name,
    sourceList,
    checked: false,
    addedBy: uid,
    addedAt: serverTimestamp(),
  })
}

export async function toggleThisWeekChecked(
  householdId: string,
  itemId: string,
  checked: boolean,
  uid: string,
): Promise<void> {
  await updateDoc(doc(db, 'households', householdId, 'thisWeek', itemId), {
    checked,
    checkedBy: checked ? uid : null,
    checkedAt: checked ? serverTimestamp() : null,
  })
}

/**
 * Writes quantity/found (and `checked`, when it changed) in one update so other devices never see a
 * half-applied state. Default values (quantity 1, found 0) remove the field rather than storing it.
 */
export async function updateThisWeekCounts(
  householdId: string,
  itemId: string,
  counts: { quantity: number; found: number; checked?: boolean },
  uid: string,
): Promise<void> {
  const data: Record<string, unknown> = {
    quantity: counts.quantity > 1 ? counts.quantity : deleteField(),
    found: counts.found > 0 ? counts.found : deleteField(),
  }
  if (counts.checked !== undefined) {
    data.checked = counts.checked
    data.checkedBy = counts.checked ? uid : null
    data.checkedAt = counts.checked ? serverTimestamp() : null
  }
  await updateDoc(doc(db, 'households', householdId, 'thisWeek', itemId), data)
}

/** An empty note removes the field entirely rather than storing an empty string. */
export async function updateThisWeekNote(householdId: string, itemId: string, note: string): Promise<void> {
  const trimmed = note.trim()
  await updateDoc(doc(db, 'households', householdId, 'thisWeek', itemId), {
    note: trimmed ? trimmed : deleteField(),
  })
}

export async function removeThisWeekItem(householdId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'households', householdId, 'thisWeek', itemId))
}

export async function clearCheckedThisWeekItems(householdId: string, itemIds: string[]): Promise<void> {
  const batch = writeBatch(db)
  for (const id of itemIds) batch.delete(doc(db, 'households', householdId, 'thisWeek', id))
  await batch.commit()
}
