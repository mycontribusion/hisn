import { categories } from '../data/categories'
import { duas } from '../data/duas'
import CategoryCard from '../components/CategoryCard'
import { useUserProgress } from '../context/UserProgressContext'
import { Link } from 'react-router-dom'

export default function Home() {
  const { recentDuas } = useUserProgress()
  
  const recentDuaObjects = recentDuas
    .map(id => duas.find(d => d.id === id))
    .filter(d => d !== undefined)

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
      </div>

      {recentDuaObjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 px-1">
            Recently Read
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .flex.overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {recentDuaObjects.map(dua => {
              const category = categories.find(c => c.id === dua!.categoryId)
              return (
                <Link
                  key={dua!.id}
                  to={`/dua/${dua!.id}`}
                  className="glass-card min-w-[240px] flex-shrink-0 p-5 rounded-2xl snap-start hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden group border"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
                        Dua #{dua!.number}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category?.name}
                    </h3>
                  </div>
                </Link>
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