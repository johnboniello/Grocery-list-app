import {
  collection,
  deleteDoc,
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

export async function removeThisWeekItem(householdId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'households', householdId, 'thisWeek', itemId))
}

export async function clearCheckedThisWeekItems(householdId: string, itemIds: string[]): Promise<void> {
  const batch = writeBatch(db)
  for (const id of itemIds) batch.delete(doc(db, 'households', householdId, 'thisWeek', id))
  await batch.commit()
}
