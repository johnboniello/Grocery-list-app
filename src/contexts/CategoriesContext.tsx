import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useCatalog } from '../hooks/useCatalog'
import { useStaticList } from '../hooks/useStaticList'
import { isBuiltInCategory, type Category } from '../types/models'

/** The household's own categories, alphabetical: every non-built-in category some item is filed under. */
const CategoriesContext = createContext<Category[] | null>(null)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { items: catalogItems } = useCatalog()
  const highFrequency = useStaticList('highFrequency')
  const lessFrequent = useStaticList('lessFrequent')

  const customCategories = useMemo(() => {
    const found = new Set<Category>()
    for (const item of [...catalogItems, ...highFrequency, ...lessFrequent]) {
      if (item.category && !isBuiltInCategory(item.category)) found.add(item.category)
    }
    return [...found].sort((a, b) => a.localeCompare(b))
  }, [catalogItems, highFrequency, lessFrequent])

  return <CategoriesContext.Provider value={customCategories}>{children}</CategoriesContext.Provider>
}

export function useCustomCategories(): Category[] {
  const ctx = useContext(CategoriesContext)
  if (!ctx) throw new Error('useCustomCategories must be used within a CategoriesProvider')
  return ctx
}
