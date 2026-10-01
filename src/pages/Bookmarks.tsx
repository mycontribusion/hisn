import { Link } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUserProgress } from '../context/UserProgressContext'
import { duas } from '../data/duas'
import { categories } from '../data/categories'
import DuaCard from '../components/DuaCard'
import CategoryCard from '../components/CategoryCard'
import { getDuaIndexById, getFirstDuaIndex, getCategoryById } from '../data/lookup'
import { Sparkles, X, Bookmark } from 'lucide-react'

const SUGGESTIONS_DISMISSED_KEY = 'bookmarksSuggestionsDismissed'
const COMPLETED_SUGGESTIONS_KEY = 'bookmarksCompletedSuggestions'

/**
 * Discovery suggestions only. These are existing chapters, never copies of them,
 * and they are never auto-bookmarked. A suggestion leaves the list only once its
 * chapter is actually bookmarked, or when the user closes the section.
 *
 * Note on Morning & Evening: the data has a single combined "In the morning and
 * evening" chapter (27) whose 25 duas all carry the same reference, so morning
 * and evening are not separable entities. They are therefore one suggestion.
 */
const SUGGESTED_CHAPTERS: { tag: string; categoryId: string }[] = [
  { tag: 'Before sleeping', categoryId: 'before-sleeping' },
  { tag: 'When waking up', categoryId: 'when-waking-up' },
  { tag: 'After salah', categoryId: 'after-salam' },
  { tag: 'Morning & evening', categoryId: 'in-the-morning-and-evening' },
  { tag: 'Before entering the bathroom', categoryId: 'before-entering-the-bathroom' },
  { tag: 'Before eating', categoryId: 'before-eating' }
]

export default function Bookmarks() {
  const {
    bookmarks,
    bookmarkedCategories,
    isCategoryBookmarked,
    addBookmarkedCategory,
    removeBookmarkedCategory
  } = useUserProgress()

  const [suggestionsDismissed, setSuggestionsDismissed] = useState<boolean>(() => {
    return localStorage.getItem(SUGGESTIONS_DISMISSED_KEY) === 'true'
  })

  useEffect(() => {
    localStorage.setItem(SUGGESTIONS_DISMISSED_KEY, String(suggestionsDismissed))
  }, [suggestionsDismissed])

  // O(n) with Set lookup instead of O(n*m) with .some()
  const bookmarkedDuas = useMemo(() => {
    const bookmarkedIds = new Set(bookmarks.map(b => b.duaId))
    return duas.filter(dua => bookmarkedIds.has(dua.id))
  }, [bookmarks])

  const bookmarkedCategoryList = useMemo(() => {
    const bookmarkedCatIds = new Set(bookmarkedCategories.map(bc => bc.categoryId))
    return categories.filter(category => bookmarkedCatIds.has(category.id))
  }, [bookmarkedCategories])

  // Every suggestion chapter that exists in the bundled data, resolved via the O(1) lookup map.
  const allSuggestions = useMemo(() => {
    return SUGGESTED_CHAPTERS.reduce<
      {
        tag: string
        categoryId: string
        name: string
        nameArabic: string
        chapterId: number
        targetPath: string
      }[]
    >((acc, { tag, categoryId }) => {
      const category = getCategoryById(categoryId)
      if (!category || category.chapterId === undefined) return acc
      const firstIdx = getFirstDuaIndex(categoryId)
      acc.push({
        tag,
        categoryId,
        name: category.name,
        nameArabic: category.nameArabic,
        chapterId: category.chapterId,
        targetPath: firstIdx !== -1 ? `/dua/${firstIdx + 1}` : '/'
      })
      return acc
    }, [])
  }, [])

  /**
   * "Currently bookmarked" and "suggestion completed" are deliberately separate.
   * Once a suggestion is acted on it is recorded in its own persisted set, so it
   * never comes back into the list even if the user later removes the bookmark.
   */
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(COMPLETED_SUGGESTIONS_KEY)
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(COMPLETED_SUGGESTIONS_KEY, JSON.stringify(completedSuggestions))
  }, [completedSuggestions])

  const completedSuggestionIds = useMemo(() => new Set(completedSuggestions), [completedSuggestions])

  const markSuggestionCompleted = useCallback((categoryId: string) => {
    setCompletedSuggestions(prev => (prev.includes(categoryId) ? prev : [...prev, categoryId]))
  }, [])

  /**
   * Migration: a suggestion already bookmarked before this state existed counts as
   * completed, so it does not resurface later. Reads/recents are never consulted.
   */
  const bookmarkedDuaCategoryIds = useMemo(() => {
    const ids = new Set<string>()
    for (const b of bookmarks) {
      const dua = duas.find(d => d.id === b.duaId)
      if (dua) ids.add(dua.categoryId)
    }
    return ids
  }, [bookmarks])

  const bookmarkedCategoryIdSet = useMemo(
    () => new Set(bookmarkedCategories.map(bc => bc.categoryId)),
    [bookmarkedCategories]
  )

  useEffect(() => {
    const alreadyCompleted = allSuggestions
      .filter(item => {
        const isBookmarked =
          bookmarkedCategoryIdSet.has(item.categoryId) ||
          bookmarkedDuaCategoryIds.has(item.categoryId)
        return isBookmarked && !completedSuggestionIds.has(item.categoryId)
      })
      .map(item => item.categoryId)

    if (alreadyCompleted.length > 0) {
      setCompletedSuggestions(prev => [...prev, ...alreadyCompleted.filter(id => !prev.includes(id))])
    }
  }, [
    allSuggestions,
    bookmarkedCategoryIdSet,
    bookmarkedDuaCategoryIds,
    completedSuggestionIds
  ])

  // Visibility depends ONLY on the completed set, never on current bookmark state.
  const remainingSuggestions = useMemo(
    () => allSuggestions.filter(item => !completedSuggestionIds.has(item.categoryId)),
    [allSuggestions, completedSuggestionIds]
  )

  const handleSuggestionBookmark = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCategoryBookmarked(categoryId)) {
      removeBookmarkedCategory(categoryId)
    } else {
      addBookmarkedCategory(categoryId)
    }
    // Handled either way: the suggestion is done and must not return.
    markSuggestionCompleted(categoryId)
  }

  const hasBookmarks = bookmarkedDuas.length > 0 || bookmarkedCategoryList.length > 0

  // Auto-close once every suggestion is bookmarked (manual close is separate).
  useEffect(() => {
    if (allSuggestions.length > 0 && remainingSuggestions.length === 0 && !suggestionsDismissed) {
      setSuggestionsDismissed(true)
    }
  }, [allSuggestions.length, remainingSuggestions.length, suggestionsDismissed])

  const suggestionsSection = !suggestionsDismissed && remainingSuggestions.length > 0 ? (
    <div className="glass-card rounded-2xl border border-dashed border-primary-300/70 dark:border-primary-700/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <Sparkles size={18} className="text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Suggested duas</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Explore these commonly used chapters and bookmark the ones you want to keep.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSuggestionsDismissed(true)}
          aria-label="Dismiss suggested duas"
          className="flex-shrink-0 -m-1 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-slate-100 dark:hover:text-gray-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
        <span>Tap a suggestion to explore it, or tap the bookmark icon to save it.</span>
      </p>

      <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800/70">
        {remainingSuggestions.map(item => {
          return (
            <div
              key={item.categoryId}
              className="flex items-center gap-2 -mx-2 px-2 rounded-xl hover:bg-primary-50/70 dark:hover:bg-primary-900/20 transition-colors"
            >
              <Link
                to={item.targetPath}
                className="flex items-center gap-3 flex-1 min-w-0 py-3 min-h-[56px]"
              >
                <span className="flex items-center justify-center w-8 h-8 flex-shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-sm">
                  {item.chapterId}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    dir="rtl"
                    className="block font-arabic text-base leading-tight text-slate-700 dark:text-slate-200 truncate"
                  >
                    {item.nameArabic}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.name}
                  </span>
                </span>
              </Link>

              <button
                type="button"
                onClick={e => handleSuggestionBookmark(e, item.categoryId)}
                aria-label={`Bookmark ${item.name}`}
                className="flex-shrink-0 p-3 -mr-1 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bookmark size={20} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  ) : null

  if (!hasBookmarks) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No bookmarks yet</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            ← Browse supplications
          </Link>
        </div>

        {suggestionsSection}
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

      {suggestionsSection}
    </div>
  )
}
