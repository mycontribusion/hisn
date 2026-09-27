import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { UserProgressProvider } from './context/UserProgressContext'
import { SearchProvider } from './context/SearchContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dua from './pages/Dua'
import Bookmarks from './pages/Bookmarks'
import Search from './pages/Search'

// Routes whose scroll position should be preserved when the user returns to them
// (e.g. the category/chapter list). Each route keeps its own independent position.
const LIST_ROUTES = new Set(['/'])

// Per-route scroll-position cache. Keyed by pathname so positions are never shared
// across different list contexts.
const scrollCache = new Map<string, number>()

// Tracks the route we are currently on, so the persistent scroll listener can
// attribute each scroll event to the correct route without depending on the
// pathname at the moment the route changes (by then the old position may be lost).
const currentPathRef = { current: '/' }

function ScrollRestore() {
  const { pathname } = useLocation()
  currentPathRef.current = pathname

  // A single, persistent scroll listener. It continuously records the current
  // scroll position under the route we are actively on. Because it is attached
  // once and never torn down, the Home scroll position is always up to date —
  // including the last position before the user navigates away.
  useEffect(() => {
    const update = () => {
      scrollCache.set(currentPathRef.current, window.scrollY ?? window.pageYOffset ?? 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // On every route change: restore a list route's saved scroll position (after the
  // new content has rendered), or reset the scroll to the top for the dua reader
  // and other routes.
  useEffect(() => {
    if (pathname.startsWith('/dua/')) {
      // Dua reader: each dua always starts at the top.
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    } else if (LIST_ROUTES.has(pathname)) {
      const saved = scrollCache.get(pathname)
      // Defer until after the new route's DOM has been painted, so the restored
      // position is measured against the fully-rendered list height.
      const restore = () => {
        if (saved !== undefined) {
          window.scrollTo(0, saved)
          document.documentElement.scrollTop = saved
          document.body.scrollTop = 0
        } else {
          // Fresh entry: start at the top.
          window.scrollTo(0, 0)
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        }
      }
      requestAnimationFrame(restore)
    } else {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [pathname])

  return null
}

function App() {
  return (
    <ThemeProvider>
      <UserProgressProvider>
        <SearchProvider>
          <Layout>
            <ScrollRestore />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dua/:duaIndex" element={<Dua />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Layout>
        </SearchProvider>
      </UserProgressProvider>
    </ThemeProvider>
  )
}

export default App