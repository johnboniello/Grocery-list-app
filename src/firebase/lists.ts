import {
  collection,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from './config'
import type { Category, DietTags, SourceList, StaticListItem } from '../types/models'

export type StaticListName = 'highFrequency' | 'lessFrequent'

function listCollection(householdId: string, listName: StaticListName) {
  return collection(db, 'households', householdId, listName)
}

export function subscribeToStaticList(
  householdId: string,
  listName: StaticListName,
  onItems: (items: StaticListItem[]) => void,
  onError: (error: Error) => void,
): () => void {
  const q = query(listCollection(householdId, listName), orderBy('name'))
  return onSnapshot(
    q,
    (snapshot) => {
      onItems(
        snapshot.docs
          .filter((d) => d.data().deleted !== true)
          .map((d) => {
            const data = d.data()
            return {
              catalogItemId: d.id,
              name: data.name,
              dietTags: data.dietTags,
              category: data.category,
            } as StaticListItem
          }),
      )
    },
    onError,
  )
}

export async function updateStaticListItemTags(
  householdId: string,
  listName: StaticListName,
  itemId: string,
  dietTags: DietTags,
): Promise<void> {
  await setDoc(doc(db, 'households', householdId, listName, itemId), { dietTags }, { merge: true })
}

/**
 * Recategorizes an item in whichever collection it lives in (each SourceList value is also
 * its collection name). Passing undefined clears the category, so the item falls under "Other".
 * `categoryEdited` marks the choice as the household's own, so resyncFromSeed won't revert it.
 */
export async function updateItemCategory(
  householdId: string,
  collectionName: SourceList,
  itemId: string,
  category: Category | undefined,
): Promise<void> {
  await updateDoc(doc(db, 'households', householdId, collectionName, itemId), {
    category: category ?? deleteField(),
    categoryEdited: true,
  })
}

/**
 * Renames an item in its source collection, and on This Week if it's there, so every tab
 * shows the new name. Only the catalog keeps `nameLower` (it backs catalog search).
 */
export async function renameItem(
  householdId: string,
  collectionName: SourceList,
  itemId: string,
  name: string,
  onThisWeek: boolean,
): Promise<void> {
  const trimmed = name.trim()
  const batch = writeBatch(db)
  batch.update(doc(db, 'households', householdId, collectionName, itemId), {
    name: trimmed,
    ...(collectionName === 'catalog' ? { nameLower: trimmed.toLowerCase() } : {}),
  })
  if (onThisWeek) batch.update(doc(db, 'households', householdId, 'thisWeek', itemId), { name: trimmed })
  await batch.commit()
}

/**
 * Deletes an item, and takes it off This Week too. A member's own custom catalog items are
 * removed outright; seed items are only marked `deleted`, because resyncFromSeed re-adds any
 * seed item that's missing and would otherwise bring them back.
 */
export async function deleteItem(householdId: string, collectionName: SourceList, itemId: string): Promise<void> {
  const ref = doc(db, 'households', householdId, collectionName, itemId)
  const snapshot = await getDoc(ref)
  const batch = writeBatch(db)
  if (collectionName === 'catalog' && snapshot.data()?.source === 'custom') {
    batch.delete(ref)
  } else {
    batch.update(ref, { deleted: true })
  }
  batch.delete(doc(db, 'households', householdId, 'thisWeek', itemId))
  await batch.commit()
}
