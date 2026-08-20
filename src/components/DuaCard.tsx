import { Link } from 'react-router-dom'
import { Dua } from '../types'
import { useUserProgress } from '../context/UserProgressContext'
import { Bookmark, Eye, EyeOff } from 'lucide-react'
import { useState, useMemo } from 'react'
import { getDuaIndexById } from '../data/lookup'

interface DuaCardProps {
  dua: Dua
  showFull?: boolean
  /** Index of the dua in the duas array. If not provided, looked up via O(1) map. */
  duaIndex?: number
}

export default function DuaCard({ dua, showFull = false, duaIndex }: DuaCardProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useUserProgress()
  const bookmarked = isBookmarked(dua.id)
  const [showTransliteration, setShowTransliteration] = useState(false)

  // O(1) lookup instead of O(n) duas.findIndex on every render
  const resolvedDuaIndex = useMemo(
    () => (duaIndex !== undefined ? duaIndex : getDuaIndexById(dua.id)),
    [duaIndex, dua.id]
  )

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (bookmarked) {
      removeBookmark(dua.id)
    } else {
      addBookmark(dua.id)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-start justify-between mb-6 relative z-10">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          Dua #{dua.number}
        </span>
        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-lg ${bookmarked
              ? 'text-primary-600 bg-primary-100 dark:bg-primary-800'
              : 'text-gray-400 hover:text-primary-600'
            }`}
        >
          <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="space-y-6 relative z-10">
        <p className="text-2xl md:text-3xl font-arabic text-right leading-[1.8] text-slate-900 dark:text-slate-100 drop-shadow-sm" dir="rtl">
          {dua.arabic}
        </p>

        {showFull && (
          <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800/50">
            {dua.transliteration && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Transliteration</span>
                  <button
                    onClick={() => setShowTransliteration(!showTransliteration)}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 px-2 py-1 rounded-md transition-colors"
                  >
                    {showTransliteration ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}
                  </button>
                </div>
                {showTransliteration && (
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 italic tracking-wide">
                    {dua.transliteration}
                  </p>
                )}
              </div>
            )}

            <p className="text-base md:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {dua.translation}
            </p>

            {dua.virtue && (
               <div className="bg-primary-50/50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800/30">
                 <p className="text-sm text-primary-800 dark:text-primary-300">
                   <strong className="font-semibold tracking-wide uppercase text-xs mr-2">Virtue:</strong>
                   {/*{dua.virtue}*/}
                 </p>
               </div>
             )}

             {dua.footnoteAr && (
               <div className="pt-2 border-t border-slate-200 dark:border-slate-800/50">
                 <p className="text-xs text-slate-500 dark:text-slate-400 italic" dir="rtl">
                   {/*{dua.footnoteAr}*/}
                 </p>
               </div>
             )}

          </div>
        )}

        {!showFull && (
          <Link
            to={`/dua/${resolvedDuaIndex + 1}`}
            className="inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Read more →
          </Link>
        )}
      </div>
    </div>
  )
}
