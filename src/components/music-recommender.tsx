'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

export function MusicRecommender() {
  const [query, setQuery] = useState('')
  const [showInput, setShowInput] = useState(true)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'animating' | 'recommendations'>('idle')
  const [words, setWords] = useState<string[]>([])

  const mockSongs = [
    "On The Road Again - Willie Nelson",
    "Life is a Highway - Rascal Flatts",
    "Born to Run - Bruce Springsteen",
    "Route 66 - Chuck Berry",
    "Take It Easy - Eagles",
    "Ramblin' Man - The Allman Brothers Band",
    "I've Been Everywhere - Johnny Cash",
    "Highway to Hell - AC/DC",
    "Free Fallin' - Tom Petty",
    "Drive My Car - The Beatles"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() === '') return
    setShowInput(false)
    setWords(query.split(' '))
    setAnimationPhase('animating')
  }

  useEffect(() => {
    if (animationPhase === 'animating') {
      const timer = setTimeout(() => {
        setAnimationPhase('recommendations')
      }, 5000) // Total animation time: 5 seconds
      return () => clearTimeout(timer)
    }
  }, [animationPhase])

  const resetSearch = () => {
    setQuery('')
    setShowInput(true)
    setAnimationPhase('idle')
    setWords([])
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-start justify-start p-4 overflow-hidden">
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-full flex flex-col items-center justify-center h-screen"
          >
            <h1 className="text-4xl font-bold text-white mb-8">Music Recommender</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Describe your music mood..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit">Go</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationPhase === 'animating' && (
          <motion.div
            key="animation"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="fixed inset-0 flex items-start justify-start p-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          >
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-tight">
              {words.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  variants={wordVariants}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationPhase === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-16"
          >
            <h3 className="text-3xl font-semibold mb-6">Recommended Songs:</h3>
            <ul className="space-y-3 mb-8">
              {mockSongs.map((song, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="text-xl"
                >
                  {song}
                </motion.li>
              ))}
            </ul>
            <Button onClick={resetSearch} className="w-full text-lg py-6">Search for Something Else</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}