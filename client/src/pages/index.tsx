import { GetStaticProps } from 'next'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import enCA from 'date-fns/locale/en-CA'

import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from './home.module.scss'
import { useContext } from 'react'
import { PlayerContext } from '../contexts/PlayerContext'

interface Episodes {
  id: string
  title: string
  thumbnail: string
  description: string
  members: string
  duration: number
  durationAsString: string
  url: string
  publishedAt: string
}

interface HomeProps {
  latestEpisodes: Episodes[]
  allEpisodes: Episodes[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext)

  return (
    <div className={ styles.homepage }>
      <section className={ styles.latestEpisodes }>
        <h2>Latest Releases</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={ episode.id }>
                <img src={ episode.thumbnail } alt={ episode.title } />

                <div className={ styles.episodeDetails }>
                  <Link href={`/episodes/${ episode.id }`}>
                    <a>{ episode.title }</a>
                  </Link>
                  <p>{ episode.members }</p>
                  <span>{ episode.publishedAt }</span>
                  <span>{ episode.durationAsString }</span>
                </div>

                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Play Episode"/>
                </button>
              </li>
            )
          })}
        </ul>

      </section>

      <section className={ styles.allEpisodes }>
          <h2>All episodes</h2>

          <table cellSpacing={ 0 }>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Members</th>
                <th>Date</th>
                <th>Duration</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allEpisodes.map(episode => {
                return (
                  <tr key={ episode.id }>
                    <td>
                      <img src={ episode.thumbnail } alt={ episode.title } />
                    </td>
                    <td>
                      <Link  href={`/episodes/${ episode.id }`}>                    
                       <a>{ episode.title }</a>
                      </Link>
                    </td>
                    <td>{ episode.members }</td>
                    <td style={{ width: 100 }}>{ episode.publishedAt }</td>
                    <td>{ episode.durationAsString }</td>
                    <td>
                      <button type="button" onClick={() => play(episode)}>
                        <img src="/play-green.svg" alt="Play Episode" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'MMM d yy', { locale: enCA }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.lenght)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
