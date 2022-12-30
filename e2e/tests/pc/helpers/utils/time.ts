import { logEvent } from './logger'

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function timeDifference(string: string, start: number, end: number) {
  const elapsed = (end - start) / 1000
  logEvent(string, `It took ${elapsed} seconds.`)
}
