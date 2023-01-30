const fgCyan = '\x1b[36m'
const bright = '\x1b[1m'
const reset = '\x1b[0m'

export const logEvent = (vendor: string, event: string) => {
  console.log(new Date().toISOString(), `${fgCyan}INFO`, `${bright}${vendor}`, `${reset}${event}`)
}
