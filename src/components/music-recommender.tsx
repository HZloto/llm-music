"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Search, Info, Play, Youtube } from "lucide-react"

export function MusicRecommender() {
  const [query, setQuery] = useState("")
  const [showInput, setShowInput] = useState(true)
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "animating" | "loading" | "recommendations"
  >("idle")
  const [words, setWords] = useState<string[]>([])
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  const mockSongs = [
    { title: "On The Road Again", artist: "Willie Nelson" },
    { title: "Life is a Highway", artist: "Rascal Flatts" },
    { title: "Born to Run", artist: "Bruce Springsteen" },
    { title: "Route 66", artist: "Chuck Berry" },
    { title: "Take It Easy", artist: "Eagles" },
    { title: "Ramblin' Man", artist: "The Allman Brothers Band" },
    { title: "I've Been Everywhere", artist: "Johnny Cash" },
    { title: "Highway to Hell", artist: "AC/DC" },
    { title: "Free Fallin'", artist: "Tom Petty" },
    { title: "Drive My Car", artist: "The Beatles" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() === "") return
    setShowInput(false)
    setWords(query.split(" "))
    setAnimationPhase("animating")
  }

  useEffect(() => {
    if (animationPhase === "animating") {
      const timer = setTimeout(() => {
        setAnimationPhase("loading")
      }, 2000)
      return () => clearTimeout(timer)
    } else if (animationPhase === "loading") {
      const timer = setTimeout(() => {
        setAnimationPhase("recommendations")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [animationPhase])

  const resetSearch = () => {
    setQuery("")
    setShowInput(true)
    setAnimationPhase("idle")
    setWords([])
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4 overflow-hidden">
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="w-full flex flex-col items-center justify-center h-screen"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <Music className="w-10 h-10 text-gray-800 mr-2" />
                <h1 className="text-3xl font-bold text-gray-800">Mood Tunes</h1>
              </div>
              <p className="text-gray-600 text-center mb-6">
                Discover the perfect playlist based on your current mood.
              </p>
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Describe your music mood..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value.slice(0, 250))}
                    maxLength={250}
                    className="flex-grow bg-gray-100 text-gray-800 placeholder-gray-500 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <Button
                    type="submit"
                    className="bg-gray-800 text-white font-semibold rounded-md px-4 py-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
            <div className="mt-4 relative w-full max-w-md">
              <button
                onMouseEnter={() => setShowHowItWorks(true)}
                onMouseLeave={() => setShowHowItWorks(false)}
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <Info className="w-4 h-4 mr-1" />
                How it works
              </button>
              <AnimatePresence>
                {showHowItWorks && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-full mt-2 p-4 bg-white rounded-lg shadow-lg w-full"
                  >
                    <p className="text-sm text-gray-600">
                      1. Enter your mood or desired vibe
                      <br />
                      2. Our AI analyzes your input
                      <br />
                      3. Get a curated playlist that matches your mood
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(animationPhase === "animating" || animationPhase === "loading") && (
          <motion.div
            key="animation"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="fixed inset-0 flex flex-col items-start justify-start p-8 bg-gray-900 bg-opacity-90"
          >
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-tight">
              {words.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  variants={wordVariants}
                  className="inline-block mr-4 mb-2"
                >
                  {word}
                </motion.span>
              ))}
              {animationPhase === "loading" && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-block"
                >
                  <motion.span
                    animate={{
                      opacity: [0, 1, 0],
                      transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
                    }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{
                      opacity: [0, 1, 0],
                      transition: { duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 },
                    }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{
                      opacity: [0, 1, 0],
                      transition: { duration: 1.5, repeat: Infinity, ease: "linear", delay: 1 },
                    }}
                  >
                    .
                  </motion.span>
                </motion.span>
              )}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationPhase === "recommendations" && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-16"
          >
            <h3 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center">
              <Music className="w-8 h-8 mr-2" />
              Your Mood Playlist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {mockSongs.map((song, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <Play className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{song.title}</h4>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button
              className="w-full text-lg py-4 bg-white text-gray-800 font-semibold rounded-md border-2 border-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center mb-4"
            >
              <Youtube className="w-6 h-6 mr-2 text-red-600" />
              Listen on YouTube
            </Button>
            <Button
              onClick={resetSearch}
              className="w-full text-lg py-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Discover New Mood
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}