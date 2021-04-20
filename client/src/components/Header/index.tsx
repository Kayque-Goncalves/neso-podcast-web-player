import enCA from 'date-fns/locale/en-CA'
import format from 'date-fns/format'

import styles from './styles.module.scss'

export function Header() {
  const currentDate = format(new Date(), 'EEEE, d MMMM', {
    locale: enCA
  })

  return (
    <header className={styles.headerContainer}>
      <h1> Neso </h1>

      <p> Always the best for you. </p>

      <span> { currentDate } </span>
    </header>
  )
}
