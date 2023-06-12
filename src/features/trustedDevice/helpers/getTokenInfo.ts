import jwtDecode from 'jwt-decode'

import { eventMonitoring } from 'libs/monitoring'

export type TokenInfo = {
  dateCreated: string
  userId: string
  location?: string
  os?: string
  source?: string
}

export const getTokenInfo = (token: string): TokenInfo | undefined => {
  try {
    return jwtDecode<TokenInfo>(token)
  } catch (e) {
    eventMonitoring.captureException(`Failed to get token info from suspicious login email: ${e}`, {
      extra: { token },
    })

    return undefined
  }
}
