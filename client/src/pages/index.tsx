import Link from 'next/link'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import enCA from 'date-fns/locale/en-CA'
import { format, parseISO } from 'date-fns'

import { api } from '../services/api'
import { usePlayer } from '../contexts/PlayerContext'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

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
  const { playList } = usePlayer()

  const episodeList = [ ...latestEpisodes, ...allEpisodes ]

  return (
    <div className={ styles.homepage }>
      <Head>
        <title> Neso | Home </title>
      </Head>
      <section className={ styles.latestEpisodes }>
        <h2>Latest Releases</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
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

                <button type="button" onClick={() => playList(episodeList, index)}>
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
              {allEpisodes.map((episode, index) => {
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
                      <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
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
