import { Category } from '../types'
import { categories } from './categories'
import { duas } from './duas'

/**
 * Pre-computed lookup maps for O(1) access.
 * These eliminate repeated O(n) linear searches (find/findIndex)
 * across components on every render.
 */

// Map: categoryId -> Category object (O(1) instead of categories.find)
export const categoryMap: Map<string, Category> = new Map(
  categories.map(c => [c.id, c])
)

// Map: categoryId -> first dua index in the duas array (O(1) instead of duas.findIndex)
export const firstDuaIndexByCategory: Map<string, number> = (() => {
  const map = new Map<string, number>()
  for (let i = 0; i < duas.length; i++) {
    const catId = duas[i].categoryId
    if (!map.has(catId)) {
      map.set(catId, i)
    }
  }
  return map
})()

// Map: duaId -> index in the duas array (O(1) instead of duas.findIndex)
export const duaIndexMap: Map<string, number> = new Map(
  duas.map((d, i) => [d.id, i])
)

/**
 * Helper: get category by ID in O(1)
 */
export function getCategoryById(id: string): Category | undefined {
  return categoryMap.get(id)
}

/**
 * Helper: get first dua index for a category in O(1)
 */
export function getFirstDuaIndex(categoryId: string): number {
  return firstDuaIndexByCategory.get(categoryId) ?? -1
}

/**
 * Helper: get dua index by dua ID in O(1)
 */
export function getDuaIndexById(duaId: string): number {
  return duaIndexMap.get(duaId) ?? -1
}
