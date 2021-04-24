import { createContext, ReactNode, useContext, useState } from 'react'

interface Episode {
  title: string
  thumbnail: string
  members: string
  duration: number
  url: string
}

interface PlayerContextData {
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  isLooping: boolean
  isShuffuling: boolean
  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void
  playNext: () => void
  setPlayingState: (state: boolean) => void
  playPrevious: () => void
  clearPlayerState: () => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
}

interface PlayerContextProviderProps {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffuling, setIsShuffuling] =  useState(false)

  function play (episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function togglePlay() { 
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffuling(!isShuffuling)
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  function playNext() {
    const nextEpisodeIndex = currentEpisodeIndex + 1

    if (isShuffuling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)

    } else if (nextEpisodeIndex < episodeList.length) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (currentEpisodeIndex > 0) setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }

  return (
    <PlayerContext.Provider value={{ 
        episodeList, 
        currentEpisodeIndex,
        setPlayingState,
        play, 
        isPlaying,
        isLooping,
        isShuffuling,
        playNext,
        playPrevious,
        playList,
        togglePlay,
        clearPlayerState,
        toggleLoop,
        toggleShuffle,
      }}>

      { children }
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}
