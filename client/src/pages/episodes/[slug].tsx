import Head from 'next/head'
import Link from 'next/link'
import enCA from "date-fns/locale/en-CA"
import { useRouter } from 'next/router'
import { format, parseISO } from "date-fns"
import { GetStaticPaths, GetStaticProps } from "next"

import { api } from "../../services/api"
import { usePlayer } from "../../contexts/PlayerContext"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"

import styles from "./episode.module.scss"

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  durationAsString: string
  url: string
  publishedAt: string
  description: string
};

type EpisodeProps = {
  episode: Episode
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer()

  const router = useRouter()

  return (
    <div className={ styles.episode }>
      <Head>
        <title> Neso | { episode.title } </title>
      </Head>
      <div className={ styles.thumbnailContainer }>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <img className={ styles.thumbnailImage } src={ episode.thumbnail } alt="Episode Thumbnail"/>
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Play Epsode"/>
        </button>
      </div>

      <header>
        <h1>{ episode.title }</h1>
        <span>{ episode.members }</span>
        <span>{ episode.publishedAt }</span>
        <span>{ episode.durationAsString }</span>
      </header>

      <div 
        className={ styles.description } 
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  })
  
  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", { locale: enCA }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24h
  }
}