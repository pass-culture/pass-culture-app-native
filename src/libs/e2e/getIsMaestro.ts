import { Platform } from 'react-native'

import { fetchWithTimeout } from 'libs/e2e/fetchWithTimeout'
import { env } from 'libs/environment'

export const getIsMaestro = async () => {
  if (env.ENV === 'production') return false

  const portToTest = Platform.OS === 'android' ? 7001 : 22_087
  try {
    const response = await fetchWithTimeout(`http://localhost:${portToTest}/status`, {
      mode: 'cors',
      headers: new Headers({ accept: 'application/json' }),
    })
    return response.ok
  } catch (e) {
    return false
  }
}
