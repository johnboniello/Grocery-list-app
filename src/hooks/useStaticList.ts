import { useEffect, useState } from 'react'
import { useHousehold } from '../contexts/HouseholdContext'
import { subscribeToStaticList, type StaticListName } from '../firebase/lists'
import type { StaticListItem } from '../types/models'

export function useStaticList(listName: StaticListName): StaticListItem[] {
  const { householdId } = useHousehold()
  const [items, setItems] = useState<StaticListItem[]>([])

  useEffect(() => {
    if (!householdId) {
      setItems([])
      return
    }
    return subscribeToStaticList(householdId, listName, setItems, (err) =>
      console.error(`${listName} subscription failed`, err),
    )
  }, [householdId, listName])

  return items
}
