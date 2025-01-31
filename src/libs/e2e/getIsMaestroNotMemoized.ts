import { Platform } from 'react-native'

import { fetchWithTimeout } from 'libs/e2e/fetchWithTimeout'
import { env } from 'libs/environment/env'

export const getIsMaestroNotMemoized = async () => {
  if (env.ENV === 'production') return false

  const portToTest = Platform.OS === 'android' ? 8081 : 22087
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
