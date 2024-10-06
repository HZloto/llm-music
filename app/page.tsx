"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Search, Play, Youtube, AlertCircle } from "lucide-react"
import Link from "next/link"

interface ApiResponse {
  recommendations: string[]
  playlist_url: string
}

export default function Component() {
  const [query, setQuery] = useState("")
  const [showInput, setShowInput] = useState(true)
  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "animating" | "loading" | "recommendations" | "error"
  >("idle")
  const [words, setWords] = useState<string[]>([])
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-serif text-gray-800">moods</h1> {/* Playfair Display */}
        <Link
          href="https://www.paypal.com/donate/?hosted_button_id=LL5B6UMWPRRKS"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-serif"
        >
          donate
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl"
            >
                <h2 className="text-4xl md:text-5xl text-gray-800 mb-4 text-center archivo-zloto w-full max-w-50rem mx-auto break-words">
                <span className="hidden md:inline">Remember when we asked friends for mixtapes?</span>
                <span className="md:hidden">No one to show you good music?</span>
                </h2>
              <p className="text-xl text-gray-600 mb-8 text-center font-serif">
                <span className="hidden md:inline">We don&#39;t have any, so we made an AI do it.</span>
                <span className="md:hidden">Let our AI do it.</span>
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit(query)
                }}
                className="w-full mb-8"
              >
                <div className="flex space-x-2">
                  <Input
                  type="text"
                  placeholder="Describe your music mood..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value.slice(0, 250))}
                  maxLength={250}
                  className="flex-grow bg-white text-gray-400 placeholder-gray-500 rounded-full p-4 focus:outline-none focus:ring-2 focus:ring-gray-300 text-lg"
                  />
                  <Button
                    type="submit"
                    className="bg-gray-800 text-white font-semibold rounded-full px-6 py-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 text-lg"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exampleSearches.map((example, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSubmit(example)}
                    className="w-xl md:w-auto h-auto text-left text-sm py-2 px-4 bg-white bg-opacity-50 text-gray-500 rounded-lg hover:bg-opacity-75 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-98 focus:outline-none focus:ring-2 focus:ring-gray-300 whitespace-pre-line"
                    >
                    {example}
                  </Button>
                ))}
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
              className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 p-4"
            >
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center font-sans mb-8"
                variants={wordVariants}
              >
                Creating your mood playlist
              </motion.h2>
              <div className="flex flex-wrap justify-center items-center">
                {words.map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    variants={wordVariants}
                    className="inline-block mr-2 mb-2 text-2xl sm:text-3xl md:text-4xl text-gray-300 font-sans"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-8"
              >
                <motion.span
                  animate={{
                    opacity: [0, 1, 0],
                    transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
                  }}
                  className="text-4xl text-white font-sans"
                >
                  .
                </motion.span>
                <motion.span
                  animate={{
                    opacity: [0, 1, 0],
                    transition: { duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 },
                  }}
                  className="text-4xl text-white font-sans"
                >
                  .
                </motion.span>
                <motion.span
                  animate={{
                    opacity: [0, 1, 0],
                    transition: { duration: 1.5, repeat: Infinity, ease: "linear", delay: 1 },
                  }}
                  className="text-4xl text-white font-sans"
                >
                  .
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {animationPhase === "recommendations" && recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8"
            >
              <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center font-sans font-bold">
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
                      }}
                      className={`song-item flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out ${
                        isHovered ? 'bg-gray-100 cursor-pointer' : 'bg-gray-50 hover:bg-gray-100'
                      } ${isDimmed ? 'opacity-50' : ''}`}
                      onMouseEnter={() => setHoveredSongIndex(index)}
                      onMouseLeave={() => setHoveredSongIndex(null)}
                      onClick={() => window.open(youtubeSearchUrl, '_blank')}
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4 transition-colors duration-300">
                        <Play className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 font-sans">{title}</h4>
                        <p className="text-sm text-gray-700">{artist}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              <Button
                className="w-full text-lg py-4 bg-white text-gray-800 font-semibold rounded-md border-2 border-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center mb-4 font-sans"
                onClick={() => window.open(recommendations.playlist_url, '_blank')}
              >
                <Youtube className="w-6 h-6 mr-2 text-red-600" />
                Listen to full playlist
              </Button>
              <Button
                onClick={resetSearch}
                className="w-full text-lg py-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center font-sans"
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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8"
            >
              <div className="flex items-center justify-center mb-6 text-red-500">
                <AlertCircle className="w-12 h-12 mr-2" />
                <h3 className="text-3xl font-semibold font-sans">Error</h3>
              </div>
              <p className="text-center text-gray-700 mb-8">{error}</p>
              <Button
                onClick={resetSearch}
                className="w-full text-lg py-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center font-sans"
              >
                <Search className="w-5 h-5 mr-2" />
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
