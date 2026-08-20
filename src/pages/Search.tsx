import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X } from 'lucide-react'
import { getFirstDuaIndex, getCategoryById, normalizedDuas, normalizedCategories, normalizeArabicText } from '../data/lookup'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQueryState] = useState(() => {
    return searchParams.get('q') || sessionStorage.getItem('lastSearchQuery') || ''
  })

  const handleQueryChange = (newQuery: string) => {
    setQueryState(newQuery)
    if (newQuery.trim()) {
      sessionStorage.setItem('lastSearchQuery', newQuery)
      setSearchParams({ q: newQuery }, { replace: true })
    } else {
      sessionStorage.removeItem('lastSearchQuery')
      setSearchParams({}, { replace: true })
    }
  }

  const results = useMemo(() => {
    const rawQuery = query.trim()
    if (rawQuery.length < 2) return { chapters: [], duas: [] }

    const qLower = rawQuery.toLowerCase()
    const qArabic = normalizeArabicText(rawQuery)

    const matchedChapters = normalizedCategories
      .filter(({ category, normalizedName, normalizedNameArabic }) =>
        normalizedName.includes(qLower) ||
        normalizedNameArabic.includes(qArabic) ||
        category.nameArabic.includes(rawQuery)
      )
      .map(item => item.category)
      .slice(0, 10)

    const matchedDuas = normalizedDuas
      .filter(({ dua, normalizedArabic, normalizedTranslation, normalizedTransliteration, normalizedReference }) =>
        normalizedArabic.includes(qArabic) ||
        dua.arabic.includes(rawQuery) ||
        normalizedTranslation.includes(qLower) ||
        normalizedTransliteration.includes(qLower) ||
        normalizedReference.includes(qLower)
      )
      .map(({ dua, index }) => ({ dua, index }))
      .slice(0, 50)

    return { chapters: matchedChapters, duas: matchedDuas }
  }, [query])

  const hasResults = results.chapters.length > 0 || results.duas.length > 0
  const hasQuery = query.trim().length >= 2

  return (
    <div className="space-y-6">
      {/* Sticky Search Input */}
      <div className="sticky top-[68px] z-30 pt-2 pb-4 -mx-4 px-4 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder="Search chapters or duas..."
            autoFocus
            className="w-full glass-card rounded-2xl py-4 pl-11 pr-12 text-slate-800 dark:text-slate-100 placeholder-slate-400 border outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-base shadow-sm"
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!hasQuery && (
        <div className="text-center py-16 text-slate-400">
          <SearchIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Search Hisnul Muslim</p>
          <p className="text-sm mt-1">Search by chapter name, Arabic text, or translation</p>
        </div>
      )}

      {/* No results */}
      {hasQuery && !hasResults && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-1">Try a different word or phrase</p>
        </div>
      )}

      {/* Chapter Results */}
      {results.chapters.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
            Chapters
          </h2>
          <div className="space-y-3">
            {results.chapters.map(category => {
              const firstDuaIndex = getFirstDuaIndex(category.id)
              return (
                <Link
                  key={category.id}
                  to={`/dua/${firstDuaIndex + 1}`}
                  className="glass-card block p-4 rounded-2xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-sm">
                      {category.chapterId}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {category.name}
                      </p>
                      <p className="text-sm font-arabic text-slate-500 dark:text-slate-400 mt-0.5" dir="rtl">
                        {category.nameArabic}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Dua Results */}
      {results.duas.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
            Duas ({results.duas.length}{results.duas.length === 50 ? '+' : ''} results)
          </h2>
          <div className="space-y-3">
            {results.duas.map(({ dua, index }) => {
              const category = getCategoryById(dua.categoryId)
              return (
                <Link
                  key={index}
                  to={`/dua/${index + 1}`}
                  className="glass-card block p-5 rounded-2xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-full">
                          Ch. {category.chapterId}
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                        Dua #{dua.number}
                      </span>
                      {category && (
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                          {category.name}
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-arabic text-right leading-relaxed text-slate-800 dark:text-slate-100 line-clamp-2" dir="rtl">
                      {dua.arabic}
                    </p>
                    {dua.translation && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {dua.translation}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
