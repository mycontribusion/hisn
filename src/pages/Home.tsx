import { categories } from '../data/categories'
import { duas } from '../data/duas'
import CategoryCard from '../components/CategoryCard'
import DuaCard from '../components/DuaCard'
import { useUserProgress } from '../context/UserProgressContext'

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
          <div className="space-y-4">
            {recentDuaObjects.map(dua => (
              <DuaCard key={dua!.id} dua={dua!} />
            ))}
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