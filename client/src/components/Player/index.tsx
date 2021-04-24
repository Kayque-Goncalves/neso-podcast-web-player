import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useEffect, useRef, useState } from 'react'

import { usePlayer } from '../../contexts/PlayerContext'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './styles.module.scss'


export function Player () {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, toggleLoop, playNext, playPrevious, isLooping, toggleShuffle, clearPlayerState, isShuffuling, setPlayingState } = usePlayer()
  
  useEffect(() => {
    if(!audioRef.current) {
      return;
    }

    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    playNext()
  }

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
          <span>{ convertDurationToTimeString(progress) }</span>
          <div className={ styles.slider }>
            { episode ? (
              <Slider 
                max={ episode.duration }
                value={ progress }
                onChange={ handleSeek }
                trackStyle={{ backgroundColor: '#04D361' }}
                railStyle={{ backgroundColor: '#9F75FF' }}
                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
              />
            ) : (
              <div className={ styles.emptyslider } />
            ) }
          </div>
          <span>{ convertDurationToTimeString(episode?.duration ?? 0) }</span>
        </div>

        { episode && (
          <audio 
            src={ episode.url } 
            ref={ audioRef } 
            autoPlay
            loop={ isLooping }
            onLoadedMetadata={ setupProgressListener }
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={ handleEpisodeEnded }
          />
        )}

        <div className={ styles.buttons }>
          <button className={ isShuffuling ? styles.isActive : '' } type="button" disabled={ !episode || episodeList.length === 1 } onClick={ toggleShuffle }>
            <img src="/shuffle.svg" alt="Shuffle" />
          </button>
          <button type="button" onClick={ playPrevious } disabled={!episode}>
            <img src="/play-previous.svg" alt="Play Previous" />
          </button>
          <button type="button" className={ styles.playButton } disabled={ !episode } onClick={ togglePlay }>
            { isPlaying 
              ? <img src="/pause.svg" alt="Pause" />
              : <img src="/play.svg" alt="Play" />
            }
          </button>
          <button type="button" onClick={ playNext } disabled={ !episode }>
            <img src="/play-next.svg" alt="Play Next" />
          </button>
          <button className={ isLooping ? styles.isActive : '' } type="button" onClick={ toggleLoop } disabled={!episode}>
            <img src="/repeat.svg" alt="Repeat" />
          </button>

        </div>
      </footer>

    </div>
  )
}
