import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Bookmark, Info, Moon, Sun, X, Search, Search as SearchIcon, Linkedin } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useSearch } from '../context/SearchContext'

/**
 * Official Gmail mark. Lucide has no brand icon, so the real logo geometry is
 * inlined here rather than adding a dependency. Uses Google's official brand
 * colours and the authentic 52x40 envelope proportions.
 */
function GmailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size * (40 / 52)} viewBox="0 0 52 40" aria-hidden="true">
      <path fill="#4285F4" d="M3.64 40h8.182V18.182L0 7.5v27.364C0 37.408 1.633 40 3.64 40z" />
      <path fill="#34A853" d="M40.182 40h8.182C50.372 40 52 37.408 52 34.864V7.5L40.182 18.182V40z" />
      <path fill="#FBBC04" d="M40.182 3.636v14.546L52 7.5V3.636C52 1.091 49.909 0 48.182 0h-4.364c-1.727 0-3.636 1.091-3.636 3.636z" />
      <path fill="#EA4335" d="M11.818 18.182 0 7.5V7.318C0 3.4 3.4 0 7.318 0h4.364c.977 0 1.955.4 2.728 1.09L26.318 14.5 23.136 18.18 11.818 12.727V18.182z" />
      <path fill="#C5221F" d="M0 7.5l11.818 11.682L23.136 7.5l3.182 3.682L14.455 24 0 7.5z" />
      <path fill="#188038" d="M52 7.5 40.182 18.182 26.318 11.182 23.136 7.5l3.182-3.682L37.545 24 52 7.5z" />
    </svg>
  )
}

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
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">
                Key Features
              </p>
              <ul className="text-gray-500 dark:text-gray-400 text-xs space-y-1.5">
                <li>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Powerful Search</span>
                  {' — Search across chapters, Arabic, translation, transliteration and references.'}
                </li>
                <li>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Smart Bookmarks</span>
                  {' — Save individual duas or entire chapters and discover useful duas through suggestions.'}
                </li>
                <li>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Quick Resume</span>
                  {' — Return to a recent chapter or jump directly back to the exact dua you were reading.'}
                </li>
              </ul>
            </div>
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

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">
                Contact Developer
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:ahmadmusamuhd@gmail.com"
                  title="Contact developer by email"
                  aria-label="Contact developer by email"
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary-600 hover:border-primary-200 dark:hover:text-primary-400 dark:hover:border-primary-800 transition-colors"
                >
                  <GmailIcon size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/dr-ahmad-musa-muhammad-b93587156/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Contact developer on LinkedIn"
                  aria-label="Contact developer on LinkedIn"
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary-600 hover:border-primary-200 dark:hover:text-primary-400 dark:hover:border-primary-800 transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}