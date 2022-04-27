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
      try {
        const { result: accessToken, error } = await refreshAccessToken(api)

        if (error) {
          eventMonitoring.captureException(error, {
            message: 'eduConnectClient failed to get refreshAccessToken',
          })
          return Promise.reject(new Error('eduConnectClient failed to get refreshAccessToken'))
        }

        return accessToken
      } catch (error) {
        eventMonitoring.captureException(error, {
          message: 'eduConnectClient failed to refreshAccessToken',
        })
        return Promise.reject(new Error('eduConnectClient failed to refreshAccessToken'))
      }
    }
    return accessToken
  },
}
