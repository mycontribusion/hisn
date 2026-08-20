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

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}

function App() {
  return (
    <ThemeProvider>
      <UserProgressProvider>
        <SearchProvider>
          <Layout>
            <ScrollToTop />
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