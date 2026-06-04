import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { UserProgressProvider } from './context/UserProgressContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dua from './pages/Dua'
import Bookmarks from './pages/Bookmarks'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <UserProgressProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dua/:duaId" element={<Dua />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </UserProgressProvider>
    </ThemeProvider>
  )
}

export default App