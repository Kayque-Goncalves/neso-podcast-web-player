import { useContext, useEffect, useRef } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { PlayerContext } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'


export function Player () {
  const audioRef = useRef<HTMLAudioElement>(null)

  const { episodeList, currentEpisodeIndex, isPlaying, togglePlay } = useContext(PlayerContext)

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play() : audioRef.current.pause()

  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={ styles.playerContainer }>
      <header>
        <img src="/playing.svg" alt="Playing Now"/>
        <strong> Playing Now </strong>
      </header>

      { episode ? (
          <div className={ styles.currentEpisode }>
            <img src={ episode.thumbnail } alt="Episode Thumbnail"/>

            <strong>{ episode.title }</strong>
            <span>{ episode.members }</span>
          </div>
      ) : (
        <div className={ styles.emptyPlayer }>
          <strong>Select a podcast to listen.</strong>
        </div>
      ) }

      <footer className={ !episode ? styles.empty : '' }>
        <div className={ styles.progress }>
          <span>00:00</span>
          <div className={ styles.slider }>
            { episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04D361' }}
                railStyle={{ backgroundColor: '#9F75FF' }}
                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
              />
            ) : (
              <div className={ styles.emptyslider } />
            ) }
          </div>
          <span>00:00</span>
        </div>

        { episode && (
          <audio src={ episode.url } ref={ audioRef } autoPlay />
        )}

        <div className={ styles.buttons }>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Shuffle" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Play Previous" />
          </button>
          <button type="button" className={ styles.playButton } disabled={!episode} onClick={ togglePlay }>
            { isPlaying 
              ? <img src="/pause.svg" alt="Pause" />
              : <img src="/play.svg" alt="Play" />
            }
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Play Next" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repeat" />
          </button>

        </div>
      </footer>

    </div>
  )
}