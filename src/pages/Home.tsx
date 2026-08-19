import { categories } from '../data/categories'
import { duas } from '../data/duas'
import CategoryCard from '../components/CategoryCard'
import { useUserProgress } from '../context/UserProgressContext'
import { Link } from 'react-router-dom'

export default function Home() {
  const { recentDuas } = useUserProgress()
  
  const recentDuaObjects = recentDuas
    .map(item => {
      const idx = parseInt(item.duaId, 10)
      return isNaN(idx) ? null : { dua: duas[idx], index: idx, duaId: item.duaId }
    })
    .filter((item): item is { dua: NonNullable<typeof duas[0]>, index: number, duaId: string } => item !== null && item.dua !== undefined)

  return (
    <div className="space-y-4">
      <div className="text-center py-2">
      </div>

      {recentDuaObjects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 px-1">
            Recently Read
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .flex.overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {recentDuaObjects.map(item => {
              const category = categories.find(c => c.id === item.dua.categoryId)
              const firstDuaIndex = category
                ? duas.findIndex(d => d.categoryId === category.id)
                : -1
              const chapterPath = firstDuaIndex !== -1 ? `/dua/${firstDuaIndex + 1}` : '/'

              return (
                <div
                  key={item.duaId}
                  className="glass-card min-w-[240px] flex-shrink-0 p-5 rounded-2xl snap-start hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden group border"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {category && (
                        <Link
                          to={chapterPath}
                          className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          Ch. {category.chapterId}
                        </Link>
                      )}
                      <Link
                        to={`/dua/${item.index + 1}`}
                        className="flex items-center justify-center bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/60 transition-colors"
                      >
                        Dua #{item.dua.number}
                      </Link>
                    </div>
                    <Link
                      to={chapterPath}
                      className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block mt-2"
                    >
                      {category?.name}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 px-1">
          All Chapters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}