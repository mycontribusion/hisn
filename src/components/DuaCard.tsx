import { Link } from 'react-router-dom'
import { Dua } from '../types'
import { useUserProgress } from '../context/UserProgressContext'
import { Bookmark, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { useState, useMemo, memo, useEffect, useRef } from 'react'
import { getDuaIndexById, getCategoryById } from '../data/lookup'

interface DuaCardProps {
  dua: Dua
  showFull?: boolean
  /** Index of the dua in the duas array. If not provided, looked up via O(1) map. */
  duaIndex?: number
}

const DuaCard = memo(function DuaCard({ dua, showFull = false, duaIndex }: DuaCardProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useUserProgress()
  const bookmarked = isBookmarked(dua.id)
  const [showTransliteration, setShowTransliteration] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear pending reset on unmount so no state update happens after leaving the reader
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  // O(1) lookup; the reader resolves the same category object for its header/title.
  const category = useMemo(() => getCategoryById(dua.categoryId), [dua.categoryId])

  /**
   * Single assembled copy of everything the reader displays for this dua, in order:
   * chapter number + chapter title, chapter Arabic title, dua number, Arabic text,
   * Transliteration (only when shown), then Translation.
   * Sections are separated by blank lines; empty ones are skipped. The chapter
   * Arabic title is emitted once — the reader shows it once, as a badge.
   */
  const buildCopyText = () => {
    const sections: string[] = []

    if (category) {
      const chapterNumber = category.chapterId ?? category.id
      sections.push(`${chapterNumber}. ${category.name}`)
      if (category.nameArabic) sections.push(category.nameArabic)
    }

    sections.push(`Dua #${dua.number}`)
    sections.push(dua.arabic)

    if (dua.transliteration && showTransliteration) {
      sections.push(`Transliteration\n${dua.transliteration}`)
    }

    sections.push(`Translation\n${dua.translation}`)

    return sections.filter(s => s.trim().length > 0).join('\n\n')
  }

  const handleCopy = async (e: React.MouseEvent) => {
    // Explicit action only: never copy because the card itself was tapped.
    e.preventDefault()
    e.stopPropagation()

    const text = buildCopyText()

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older WebViews without the async Clipboard API
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy dua text:', err)
    }
  }

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
        <div className="flex items-center gap-1">
          {showFull && (
            <button
              onClick={handleCopy}
              aria-label="Copy dua text"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                copied
                  ? 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-800'
                  : 'text-gray-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
          <button
            onClick={handleBookmark}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this dua'}
            className={`p-1.5 rounded-lg ${bookmarked
              ? 'text-primary-600 bg-primary-100 dark:bg-primary-800'
              : 'text-gray-400 hover:text-primary-600'
            }`}
          >
            <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
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
                  <span className={`text-xs uppercase tracking-wider font-semibold ${showTransliteration ? 'text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>Transliteration</span>
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

            <div>
              <span className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Translation
              </span>
              <p className="text-base md:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {dua.translation}
              </p>
            </div>

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
})

export default DuaCard
