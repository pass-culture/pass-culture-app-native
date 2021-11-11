import FingerprintJS from '@fingerprintjs/fingerprintjs'

const fpPromise = FingerprintJS.load()

export async function getUniqueId() {
  try {
    const fp = await fpPromise
    const { visitorId } = await fp.get()
    return visitorId
  } catch (err) {
    return ''
  }
}
