import { collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'
import { db } from './config'
import type { DietTags, StaticListItem } from '../types/models'

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
          return { catalogItemId: d.id, name: data.name, dietTags: data.dietTags } as StaticListItem
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
