export const isValidHttpsUrl = (identificationUrl: string): boolean => {
  try {
    const url = new URL(identificationUrl)
    return url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

export const isValidUbbleUrl = (identificationUrl: string): boolean => {
  try {
    const url = new URL(identificationUrl)
    return url.protocol === 'https:' && url.hostname == 'id.ubble.ai'
  } catch (_) {
    return false
  }
}
