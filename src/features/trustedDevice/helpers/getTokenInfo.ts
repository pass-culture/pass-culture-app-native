import jwtDecode from 'jwt-decode'

import { eventMonitoring } from 'libs/monitoring/services'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export type TokenInfo = {
  exp: number
  user_id: number
  data: { dateCreated: string; location?: string; os?: string; source?: string }
}

export const getTokenInfo = (token: string): TokenInfo | undefined => {
  try {
    return jwtDecode<TokenInfo>(token)
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    eventMonitoring.captureException(
      `Failed to get token info from suspicious login email: ${errorMessage}`,
      {
        extra: { token, error },
      }
    )

    return undefined
  }
}
