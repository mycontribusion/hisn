import { Link } from 'react-router-dom'
import { useUserProgress } from '../context/UserProgressContext'
import { duas } from '../data/duas'
import { categories } from '../data/categories'
import DuaCard from '../components/DuaCard'
import CategoryCard from '../components/CategoryCard'

export default function Bookmarks() {
  const { bookmarks, bookmarkedCategories } = useUserProgress()

  const bookmarkedDuas = duas.filter(dua => 
    bookmarks.some(b => b.duaId === dua.id)
  )

  const bookmarkedCategoryList = categories.filter(category =>
    bookmarkedCategories.some(bc => bc.categoryId === category.id)
  )

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
            {bookmarkedCategoryList.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
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
              <DuaCard key={dua.id} dua={dua} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}