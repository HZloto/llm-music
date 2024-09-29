"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Search, Info, Play, Youtube, AlertCircle } from "lucide-react"

interface ApiResponse {
  recommendations: string[];  // List of songs in "Artist - Song Title" format
  playlist_url: string;
}

export function MusicRecommender() {
  const [query, setQuery] = useState("")
  const [showInput, setShowInput] = useState(true)
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "animating" | "loading" | "recommendations" | "error"
  >("idle")
  const [words, setWords] = useState<string[]>([])
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [recommendations, setRecommendations] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hoveredSongIndex, setHoveredSongIndex] = useState<number | null>(null)

  const exampleSearches = [
    "90s house music for a party\nDisclosure style",
    "Sing along 2000s pop songs\nfor a road trip",
    "Relaxing ambient music\nfor a yoga class"
  ]

  const handleSubmit = async (searchQuery: string) => {
    if (searchQuery.trim() === "") return
    setShowInput(false)
    setWords(searchQuery.split(" "))
    setAnimationPhase("animating")

    try {
      const response = await fetch('https://music-recommender-tcip.fly.dev/get-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_prompt: searchQuery }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data: ApiResponse = await response.json()
      setRecommendations(data)
      setAnimationPhase("recommendations")
    } catch (err) {
      console.error(err)
      setError('An error occurred while fetching recommendations. Please try again.')
      setAnimationPhase("error")
    }
  }

  useEffect(() => {
    if (animationPhase === "animating") {
      const timer = setTimeout(() => {
        setAnimationPhase("loading")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [animationPhase])

  const resetSearch = () => {
    setQuery("")
    setShowInput(true)
    setAnimationPhase("idle")
    setWords([])
    setRecommendations(null)
    setError(null)
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
            className="w-full flex flex-col items-center justify-center min-h-screen"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mb-8">
              <div className="flex items-center justify-center mb-6">
                <Music className="w-10 h-10 text-gray-800 mr-2" />
                <h1 className="text-3xl font-bold text-gray-800">Mood Tunes</h1>
              </div>
              <p className="text-gray-600 text-center mb-6">
                Discover the perfect playlist based on your current mood.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit(query)
                }}
                className="w-full mb-4"
              >
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
              <div className="relative w-full">
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
                      className="absolute left-0 top-full mt-2 p-4 bg-white rounded-lg shadow-lg w-full z-10"
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
            </div>
            <div className="w-full max-w-4xl">
              <p className="text-sm text-gray-500 mb-4 text-center">Example searches:</p>
              <div className="w-[70%] mx-auto md:w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exampleSearches.map((example, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSubmit(example)}
                      className="w-full h-24 text-left text-sm py-2 px-4 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-200 ease-in-out transform hover:scale-98 focus:outline-none focus:ring-2 focus:ring-gray-300 whitespace-pre-line"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
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
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationPhase === "recommendations" && recommendations && (
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
              {recommendations.recommendations.map((song, index) => {
                const [artist, title] = song.split(" - ")
                const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                  artist
                )}+-+${encodeURIComponent(title)}`
                const isHovered = hoveredSongIndex === index
                const isDimmed = hoveredSongIndex !== null && hoveredSongIndex !== index

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: [0.43, 0.13, 0.23, 0.96],
                    }}
                    className={`song-item flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-98 focus:outline-none ${
                      isHovered ? 'bg-gray-100 cursor-custom' : 'bg-gray-50 hover:bg-gray-100'
                    } ${isDimmed ? 'opacity-50' : ''}`}
                    onMouseEnter={() => setHoveredSongIndex(index)}
                    onMouseLeave={() => setHoveredSongIndex(null)}
                    onClick={() => window.open(youtubeSearchUrl, '_blank')}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4 transition-colors duration-300">
                      <Play className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                      <p className="text-sm text-gray-700">{artist}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <Button
              className="w-full text-lg py-4 bg-white text-gray-800 font-semibold rounded-md border-2 border-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center mb-4 transition-all duration-300 ease-in-out transform hover:scale-98"
              onClick={() => window.open(recommendations.playlist_url, '_blank')}
            >
              <Youtube className="w-6 h-6 mr-2 text-red-600" />
              Listen to full playlist
            </Button>
            <Button
              onClick={resetSearch}
              className="w-full text-lg py-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-98"
            >
              <Search className="w-5 h-5 mr-2" />
              Discover New Mood
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationPhase === "error" && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-16"
          >
            <div className="flex items-center justify-center mb-6 text-red-500">
              <AlertCircle className="w-12 h-12 mr-2" />
              <h3 className="text-3xl font-semibold">Error</h3>
            </div>
            <p className="text-center text-gray-700 mb-8">{error}</p>
            <Button
              onClick={resetSearch}
              className="w-full text-lg py-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .cursor-custom {
          cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="black" height="24" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="12"/></svg>') 12 12, auto;
        }
      `}</style>
    </div>
  )
}
