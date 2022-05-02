import { api } from 'api/api'
import { refreshAccessToken } from 'api/apiHelpers'
import { env } from 'libs/environment'
import { getAccessTokenStatus } from 'libs/jwt'
import { eventMonitoring } from 'libs/monitoring'
import { storage } from 'libs/storage'

export const eduConnectClient = {
  getLoginUrl() {
    return `${env.API_BASE_URL}/saml/educonnect/login`
  },
  async getAccessToken() {
    const accessToken = await storage.readString('access_token')
    const accessTokenStatus = getAccessTokenStatus(accessToken)
    if (accessTokenStatus === 'unknown') {
      eventMonitoring.captureMessage('eduConnectClient failed to decodeAccessToken')
      return Promise.reject(new Error())
    }
    if (accessTokenStatus === 'expired') {
      const { result, error } = await refreshAccessToken(api)

      if (error) {
        eventMonitoring.captureException(new Error(`eduConnectClient ${error}`))
        return Promise.reject(new Error(`eduConnectClient ${error}`))
      }

      return result
    }
    return accessToken
  },
}
