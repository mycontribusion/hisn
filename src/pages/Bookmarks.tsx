import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useUserProgress } from '../context/UserProgressContext'
import { duas } from '../data/duas'
import { categories } from '../data/categories'
import DuaCard from '../components/DuaCard'
import CategoryCard from '../components/CategoryCard'
import { getDuaIndexById, getFirstDuaIndex } from '../data/lookup'

export default function Bookmarks() {
  const { bookmarks, bookmarkedCategories } = useUserProgress()

  // O(n) with Set lookup instead of O(n*m) with .some()
  const bookmarkedDuas = useMemo(() => {
    const bookmarkedIds = new Set(bookmarks.map(b => b.duaId))
    return duas.filter(dua => bookmarkedIds.has(dua.id))
  }, [bookmarks])

  const bookmarkedCategoryList = useMemo(() => {
    const bookmarkedCatIds = new Set(bookmarkedCategories.map(bc => bc.categoryId))
    return categories.filter(category => bookmarkedCatIds.has(category.id))
  }, [bookmarkedCategories])

  if (bookmarkedDuas.length === 0 && bookmarkedCategoryList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">No bookmarks yet</p>
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          ← Browse supplications
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Your Bookmarks
      </h2>

      {bookmarkedCategoryList.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Bookmarked Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedCategoryList.map(category => {
              const firstIdx = getFirstDuaIndex(category.id)
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  targetPath={firstIdx !== -1 ? `/dua/${firstIdx + 1}` : '/'}
                />
              )
            })}
          </div>
        </div>
      )}

      {bookmarkedDuas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Bookmarked Supplications
          </h3>
          <div className="space-y-4">
            {bookmarkedDuas.map(dua => (
              <DuaCard key={dua.id} dua={dua} duaIndex={getDuaIndexById(dua.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
