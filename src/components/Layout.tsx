import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Bookmark, Info, Moon, Sun, X, Search, Search as SearchIcon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useSearch } from '../context/SearchContext'

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [showAbout, setShowAbout] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' }
  ]

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const { query, setQuery } = useSearch()
  const isSearchPage = location.pathname === '/search'

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-500/30">
      <header className="glass-header sticky top-0">
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          {!isSearchPage && (
            <h1 className="text-2xl font-bold font-arabic tracking-wide bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
              <Link to="/">حصن المسلم</Link>
            </h1>
          )}
          {isSearchPage && (
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search chapters or duas..."
                autoFocus
                className="w-full glass-card rounded-xl py-1.5 pl-9 pr-9 text-slate-800 dark:text-slate-100 placeholder-slate-400 border outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm shadow-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}
          {!isSearchPage && (
            <div className="flex items-center gap-1">
              <Link
                to="/search"
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </Link>
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
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom nav surface: min-h-[58px] with ~44px button pills centred inside,
          leaving breathing room above/below and separating it from the body via
          top border + upward shadow. Slightly taller than the header by design. */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_16px_rgb(0,0,0,0.06)] dark:shadow-[0_-4px_16px_rgb(0,0,0,0.35)] pb-safe min-h-[58px] flex items-center">
        <div className="container mx-auto flex items-center gap-3 px-4 max-w-md w-full">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800/60'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
              </Link>
            )
          })}
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