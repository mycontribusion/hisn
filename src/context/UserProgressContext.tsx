import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react'
import { UserProgress, Bookmark, BookmarkedCategory, RecentDua } from '../types'

interface UserProgressContextType {
  progress: UserProgress
  bookmarks: Bookmark[]
  bookmarkedCategories: BookmarkedCategory[]
  recentDuas: RecentDua[]
  recentCategories: string[]
  setLastReadDuaId: (duaId: string) => void
  setLastReadCategoryId: (categoryId: string) => void
  addBookmark: (duaId: string) => void
  removeBookmark: (duaId: string) => void
  isBookmarked: (duaId: string) => boolean
  addBookmarkedCategory: (categoryId: string) => void
  removeBookmarkedCategory: (categoryId: string) => void
  isCategoryBookmarked: (categoryId: string) => boolean
  incrementRead: () => void
  addRecentDua: (duaId: string, chapterId: string) => void
  addRecentCategory: (categoryId: string) => void
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined)

const defaultProgress: UserProgress = {
  totalRead: 0,
  lastReadDate: '',
  streak: 0,
  readToday: false
}

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('userProgress')
    return saved ? JSON.parse(saved) : defaultProgress
  })

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('bookmarks')
    return saved ? JSON.parse(saved) : []
  })

  const [bookmarkedCategories, setBookmarkedCategories] = useState<BookmarkedCategory[]>(() => {
    const saved = localStorage.getItem('bookmarkedCategories')
    return saved ? JSON.parse(saved) : []
  })

  const [recentDuas, setRecentDuas] = useState<RecentDua[]>(() => {
    const saved = localStorage.getItem('recentDuas')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          return parsed.map(id => ({ duaId: id, chapterId: '' }))
        }
        return parsed
      } catch {
        return []
      }
    }
    return []
  })

  const [recentCategories, setRecentCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentCategories')
    return saved ? JSON.parse(saved) : []
  })

  // Pre-compute Sets for O(1) lookups instead of O(n) .some() scans
  const bookmarkedDuaIds = useMemo(
    () => new Set(bookmarks.map(b => b.duaId)),
    [bookmarks]
  )
  const bookmarkedCategoryIds = useMemo(
    () => new Set(bookmarkedCategories.map(bc => bc.categoryId)),
    [bookmarkedCategories]
  )

  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    localStorage.setItem('bookmarkedCategories', JSON.stringify(bookmarkedCategories))
  }, [bookmarkedCategories])

  useEffect(() => {
    localStorage.setItem('recentDuas', JSON.stringify(recentDuas))
  }, [recentDuas])

  useEffect(() => {
    localStorage.setItem('recentCategories', JSON.stringify(recentCategories))
  }, [recentCategories])

  const setLastReadDuaId = useCallback((duaId: string) => {
    setProgress(prev => ({
      ...prev,
      lastReadDuaId: duaId
    }))
  }, [])

  const setLastReadCategoryId = useCallback((categoryId: string) => {
    setProgress(prev => ({
      ...prev,
      lastReadCategoryId: categoryId
    }))
  }, [])

  const addRecentDua = useCallback((duaId: string, chapterId: string) => {
    setRecentDuas(prev => {
      const filtered = prev.filter(item => item.chapterId !== chapterId)
      return [{ duaId, chapterId }, ...filtered].slice(0, 5)
    })
  }, [])

  const addRecentCategory = useCallback((categoryId: string) => {
    setRecentCategories(prev => {
      const filtered = prev.filter(id => id !== categoryId)
      return [categoryId, ...filtered].slice(0, 5)
    })
  }, [])

  const addBookmark = useCallback((duaId: string) => {
    if (!bookmarkedDuaIds.has(duaId)) {
      setBookmarks(prev => [...prev, { duaId, addedAt: new Date().toISOString() }])
    }
  }, [bookmarkedDuaIds])

  const removeBookmark = useCallback((duaId: string) => {
    setBookmarks(prev => prev.filter(b => b.duaId !== duaId))
  }, [])

  const isBookmarked = useCallback((duaId: string) => {
    return bookmarkedDuaIds.has(duaId)
  }, [bookmarkedDuaIds])

  const addBookmarkedCategory = useCallback((categoryId: string) => {
    if (!bookmarkedCategoryIds.has(categoryId)) {
      setBookmarkedCategories(prev => [...prev, { categoryId, addedAt: new Date().toISOString() }])
    }
  }, [bookmarkedCategoryIds])

  const removeBookmarkedCategory = useCallback((categoryId: string) => {
    setBookmarkedCategories(prev => prev.filter(c => c.categoryId !== categoryId))
  }, [])

  const isCategoryBookmarked = useCallback((categoryId: string) => {
    return bookmarkedCategoryIds.has(categoryId)
  }, [bookmarkedCategoryIds])

  const incrementRead = useCallback(() => {
    setProgress(prev => {
      const today = new Date().toDateString()
      const lastRead = prev.lastReadDate ? new Date(prev.lastReadDate).toDateString() : ''
      return {
        ...prev,
        totalRead: prev.totalRead + 1,
        lastReadDate: new Date().toISOString(),
        readToday: today === lastRead ? prev.readToday : true,
        streak: today === lastRead ? prev.streak : prev.streak + 1
      }
    })
  }, [])

  return (
    <UserProgressContext.Provider value={{
      progress,
      bookmarks,
      bookmarkedCategories,
      recentDuas,
      recentCategories,
      setLastReadDuaId,
      setLastReadCategoryId,
      addBookmark,
      removeBookmark,
      isBookmarked,
      addBookmarkedCategory,
      removeBookmarkedCategory,
      isCategoryBookmarked,
      incrementRead,
      addRecentDua,
      addRecentCategory
    }}>
      {children}
    </UserProgressContext.Provider>
  )
}

export function useUserProgress() {
  const context = useContext(UserProgressContext)
  if (!context) {
    throw new Error('useUserProgress must be used within a UserProgressProvider')
  }
  return context
}
