import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { UserProgressProvider } from './context/UserProgressContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dua from './pages/Dua'
import Bookmarks from './pages/Bookmarks'
import Search from './pages/Search'

function App() {
  return (
    <ThemeProvider>
      <UserProgressProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dua/:duaIndex" element={<Dua />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Layout>
      </UserProgressProvider>
    </ThemeProvider>
  )
}

export default App