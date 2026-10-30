import { plural } from 'libs/plural'

const ONE_MINUTE = 60

export const formatRemainingTime = (remainingSeconds: number): string => {
  if (remainingSeconds < ONE_MINUTE) {
    return plural(remainingSeconds, { singular: '# seconde', plural: '# secondes' })
  }

  const remainingMinutes = Math.ceil(remainingSeconds / ONE_MINUTE)
  if (remainingMinutes >= 60) return '1 heure'
  return plural(remainingMinutes, { singular: '# minute', plural: '# minutes' })
}
