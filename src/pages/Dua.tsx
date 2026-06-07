import { useParams, useNavigate } from 'react-router-dom'
import { duas } from '../data/duas'
import { categories } from '../data/categories'
import DuaCard from '../components/DuaCard'
import { useUserProgress } from '../context/UserProgressContext'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Dua() {
  const { duaIndex } = useParams<{ duaIndex: string }>()
  const navigate = useNavigate()
  
  const currentIndex = parseInt(duaIndex ?? '1', 10) - 1
  const dua = duas[currentIndex] ?? null
  const category = dua ? categories.find(c => c.id === dua.categoryId) : null
  
  const { incrementRead, addRecentDua, setLastReadDuaId, setLastReadCategoryId, addRecentCategory } = useUserProgress()
  const [direction, setDirection] = useState(0)
  const currentDuaIdRef = useRef<string | null>(null)
  const currentCategoryIdRef = useRef<string | null>(null)

  // Keep tracking the current active dua/category index/id
  useEffect(() => {
    if (dua) {
      currentDuaIdRef.current = String(currentIndex)
      currentCategoryIdRef.current = dua.categoryId
      incrementRead()
      setLastReadCategoryId(dua.categoryId)
      setLastReadDuaId(String(currentIndex))
    }
  }, [currentIndex, dua, incrementRead, setLastReadCategoryId, setLastReadDuaId])

  // Save to recent list on component unmount (returning home) or when exiting/backgrounding the app
  useEffect(() => {
    const saveToRecent = () => {
      if (currentDuaIdRef.current && currentCategoryIdRef.current) {
        addRecentDua(currentDuaIdRef.current)
        addRecentCategory(currentCategoryIdRef.current)
      }
    }

    const handleBeforeUnload = () => {
      saveToRecent()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveToRecent()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      saveToRecent()
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [addRecentDua, addRecentCategory])

  if (!dua) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Dua not found</p>
        <button onClick={() => navigate('/')} className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          ← Back to Home
        </button>
      </div>
    )
  }

  const handleNext = () => {
    setDirection(1)
    const nextIndex = (currentIndex + 1) % duas.length
    navigate(`/dua/${nextIndex + 1}`)
  }

  const handlePrev = () => {
    setDirection(-1)
    const prevIndex = (currentIndex - 1 + duas.length) % duas.length
    navigate(`/dua/${prevIndex + 1}`)
  }

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? -300 : 300,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? -300 : 300,
        opacity: 0
      };
    }
  };

  const swipeConfidenceThreshold = 300;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="space-y-6 overflow-hidden relative min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-2 gap-2">
        <button className="text-slate-500 hover:text-primary-600 flex items-center gap-2 font-semibold transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700/50 max-w-[50%]">
          {/*<Home size={16} className="shrink-0" /> 
          <span className="truncate">{category?.name || 'Home'}</span>*/}
        </button>
        {category && (
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-full border border-primary-100 dark:border-primary-800/30 truncate max-w-[50%] drop-shadow-sm" dir="rtl">
            {category.nameArabic}
          </span>
        )}
      </div>

      <div className="w-full flex-1">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={dua.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handlePrev();
              } else if (swipe > swipeConfidenceThreshold) {
                handleNext();
              }
            }}
            className="w-full touch-pan-y cursor-grab active:cursor-grabbing pb-8"
          >
            {category && (
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 px-4 drop-shadow-sm">
                  {category.name}
                </h2>
              </div>
            )}
            <DuaCard dua={dua} showFull={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation bar - fixed above footer */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center items-center gap-4 mb-2 z-[60]">
        <button 
          onClick={handleNext} 
          className="p-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          aria-label="Next dua"
        >
          <ChevronLeft size={16} className="text-slate-700 dark:text-slate-300" />
        </button>
        <span className="text-xs text-slate-500 font-bold tracking-wider glass-card rounded-full px-3 py-1">
          {currentIndex + 1} <span className="opacity-50 mx-1">/</span> {duas.length}
        </span>
        <button 
          onClick={handlePrev} 
          className="p-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          aria-label="Previous dua"
        >
          <ChevronRight size={16} className="text-slate-700 dark:text-slate-300" />
        </button>
      </div>
    </div>
  )
}