import { useTheme } from '../context/ThemeContext'
import { Theme } from '../types'

export default function Settings() {
  const { theme, setTheme } = useTheme()

  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Settings
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Theme
        </h3>
        <div className="flex gap-2">
          {themeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
          About
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Hisnul Muslim (Fortress of the Muslim) is a collection of authentic supplications
          and remembrances from the Quran and Sunnah. This app helps you memorize and
          regularly recite these important duas.
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-3">
          All supplications are from the famous book "Hisnul Muslim" by Sheikh Nasiruddin Albani.
        </p>
      </div>
    </div>
  )
}