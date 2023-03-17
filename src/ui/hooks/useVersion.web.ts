import Package from '../../../package.json'

export function useVersion() {
  return `Version\u00A0${Package.version}`
}
