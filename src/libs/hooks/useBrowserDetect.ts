export const useBrowserDetect = () => {
  return typeof navigator.userAgent !== 'undefined' ? { isBrowser: true } : { isBrowser: false }
}
