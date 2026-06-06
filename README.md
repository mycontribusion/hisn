# حصن المسلم (Hisnul Muslim) - Fortress of the Muslim

A modern, responsive web application for browsing and reading authentic supplications (duas) and remembrances from the Quran and Sunnah.

## Features

- 📱 **PWA Support** - Installable as a Progressive Web App for offline access
- 🌙 **Dark/Light Mode** - Automatic system theme detection with manual toggle
- 🔖 **Bookmarks** - Save your favorite duas for quick access
- 🔍 **Search** - Find duas by content or category
- 📊 **Reading Progress** - Track your reading streak and progress
- 🔊 **Audio Support** - Listen to authentic recitations
- 🎨 **Modern UI** - Clean, glass-morphism design with smooth animations

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **vite-plugin-pwa** - PWA support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CategoryCard.tsx  # Category display card
│   ├── DuaCard.tsx       # Dua display card
│   └── Layout.tsx        # Main layout with navigation
├── context/              # React context providers
│   ├── ThemeContext.tsx  # Theme management
│   └── UserProgressContext.tsx  # User progress tracking
├── data/                 # Data files
│   ├── categories.ts     # Category definitions
│   └── duas.ts           # Dua data
├── pages/                # Application pages
│   ├── Home.tsx          # Home page with categories
│   ├── Dua.tsx           # Individual dua view
│   ├── Bookmarks.tsx     # Bookmarked duas
│   ├── Search.tsx        # Search page
│   └── Settings.tsx      # Settings page
└── types/                # TypeScript type definitions
    └── index.ts
```

## Features in Detail

### Categories

The app includes duas organized into chapters covering various aspects of daily life:

- When waking up / Before sleeping
- Before/after prayers
- Morning and evening remembrances
- For anxiety, fear, and distress
- When visiting the mosque
- And many more...

### User Progress

Track your reading journey with:
- Streak counter
- Last read date
- Recently read duas

### Theme System

Three theme options available:
- Light mode
- Dark mode
- System (follows OS preference)

## Data Sources

The dua content in this application is sourced from the following repositories and websites:

- **[wafaaelmaandy/Hisn-Muslim-Json](https://github.com/wafaaelmaandy/Hisn-Muslim-Json)** - JSON data for Hisnul Muslim
- **[rn0x/hisn_almuslim_json](https://github.com/rn0x/hisn_almuslim_json)** - Hisnul Muslim JSON dataset
- **[sunnah.com](https://sunnah.com)** - Authentic supplications from the Quran and Sunnah

## License

This project is for educational and personal use. The dua content is sourced from authentic Islamic texts.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.