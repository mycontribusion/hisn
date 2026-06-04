import { Link } from 'react-router-dom'
import { Category } from '../types'
import { useUserProgress } from '../context/UserProgressContext'
import { Bookmark } from 'lucide-react'
import { duas } from '../data/duas'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { isCategoryBookmarked, addBookmarkedCategory, removeBookmarkedCategory } = useUserProgress()
  const bookmarked = isCategoryBookmarked(category.id)

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (bookmarked) {
      removeBookmarkedCategory(category.id)
    } else {
      addBookmarkedCategory(category.id)
    }
  }

  const firstDua = duas.find(d => d.categoryId === category.id)
  const targetPath = firstDua ? `/dua/${firstDua.id}` : '/'

  return (
    <Link
      to={targetPath}
      className={`glass-card block p-5 rounded-2xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start justify-between z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-sm">
              {category.chapterId}
            </span>
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-base font-arabic text-slate-500 dark:text-slate-400 mt-1" dir="rtl">
            {category.nameArabic}
          </p>
        </div>
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-xl transition-colors ${
            bookmarked
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/40'
              : 'text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
    </Link>
  )
}