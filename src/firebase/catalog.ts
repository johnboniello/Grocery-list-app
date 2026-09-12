import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './config'
import type { CatalogItem, DietTags } from '../types/models'

function catalogCollection(householdId: string) {
  return collection(db, 'households', householdId, 'catalog')
}

export function subscribeToCatalog(
  householdId: string,
  onItems: (items: CatalogItem[]) => void,
  onError: (error: Error) => void,
): () => void {
  const q = query(catalogCollection(householdId), orderBy('name'))
  return onSnapshot(
    q,
    (snapshot) => {
      onItems(
        snapshot.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            name: data.name,
            nameLower: data.nameLower,
            source: data.source,
            dietTags: data.dietTags,
          } as CatalogItem
        }),
      )
    },
    onError,
  )
}

function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug ? `custom-${slug}` : `custom-${Date.now()}`
}

/** Adds a new catalog item, or merges onto an existing one with the same generated id (dedup by name). */
export async function addCustomCatalogItem(
  householdId: string,
  uid: string,
  name: string,
  dietTags: DietTags | undefined,
): Promise<{ id: string; name: string }> {
  const trimmed = name.trim()
  const id = slugify(trimmed)
  await setDoc(
    doc(db, 'households', householdId, 'catalog', id),
    {
      name: trimmed,
      nameLower: trimmed.toLowerCase(),
      source: 'custom',
      createdBy: uid,
      createdAt: serverTimestamp(),
      ...(dietTags ? { dietTags } : {}),
    },
    { merge: true },
  )
  return { id, name: trimmed }
}

export async function updateCatalogItemTags(
  householdId: string,
  itemId: string,
  dietTags: DietTags,
): Promise<void> {
  await setDoc(doc(db, 'households', householdId, 'catalog', itemId), { dietTags }, { merge: true })
}
