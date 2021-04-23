import { createContext } from 'react'

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
  play: (episode: Episode) => void
  togglePlay: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)