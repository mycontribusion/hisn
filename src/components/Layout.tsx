import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Bookmark, Info, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Theme } from '../types'

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [showAbout, setShowAbout] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' }
  ]

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    setTheme(themes[(currentIndex + 1) % themes.length])
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-500/30">
      <header className="glass-header sticky top-0">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <h1 className="text-2xl font-bold font-arabic tracking-wide bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
            <Link to="/">حصن المسلم</Link>
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowAbout(true)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="About"
            >
              <Info size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' && <Sun size={20} />}
              {theme === 'dark' && <Moon size={20} />}
              {theme === 'system' && <span className="text-sm font-medium">Auto</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass-header border-t-0 border-b-0 border-t border-white/20 dark:border-slate-800/50 pb-safe pt-1">
        <div className="container mx-auto flex justify-around items-center py-2 px-4 max-w-md">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                location.pathname === path
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 scale-110'
                  : 'text-slate-500 hover:text-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon size={22} strokeWidth={location.pathname === path ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAbout(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              About
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Hisnul Muslim (Fortress of the Muslim) is a collection of authentic supplications
              and remembrances from the Quran and Sunnah. This app helps you memorize and
              regularly recite these important duas.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-3">
              All supplications are from the famous book "Hisnul Muslim" by Shaykh Sa'id bin Ali bin Wahf Al-Qahtani (1952–2018).
            </p>
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">
                Data Sources:
              </p>
              <ul className="text-gray-500 dark:text-gray-400 text-xs space-y-1">
                <li>
                  <a
                    href="https://github.com/wafaaelmaandy/Hisn-Muslim-Json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    wafaaelmaandy/Hisn-Muslim-Json
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/rn0x/hisn_almuslim_json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    rn0x/hisn_almuslim_json
                  </a>
                </li>
                <li>
                  <a
                    href="https://sunnah.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    sunnah.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}