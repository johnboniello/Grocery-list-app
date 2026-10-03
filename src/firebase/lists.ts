import { collection, deleteField, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore'
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
        snapshot.docs.map((d) => {
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
