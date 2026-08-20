import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQueryState] = useState(() => {
    return searchParams.get('q') || sessionStorage.getItem('lastSearchQuery') || ''
  })

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery)
    if (newQuery.trim()) {
      sessionStorage.setItem('lastSearchQuery', newQuery)
      setSearchParams({ q: newQuery }, { replace: true })
    } else {
      sessionStorage.removeItem('lastSearchQuery')
      setSearchParams({}, { replace: true })
    }
  }, [setSearchParams])

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
