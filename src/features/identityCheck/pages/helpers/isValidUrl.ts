import * as isValidUrl from './isValidUrl'

export const isValidHttpsUrl = (identificationUrl: string, hostname?: string): boolean => {
  try {
    const url = new URL(identificationUrl)
    return url.protocol === 'https:' && (hostname ? url.hostname === hostname : true)
  } catch (e) {
    return false
  }
}

export const isValidUbbleUrl = (identificationUrl: string): boolean =>
  // needed for spy in tests cf. https://stackoverflow.com/questions/45111198/how-to-mock-functions-in-the-same-module-using-jest
  isValidUrl.isValidHttpsUrl(identificationUrl, 'id.ubble.ai')
