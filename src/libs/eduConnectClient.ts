import { api } from 'api/api'
import { refreshAccessToken } from 'api/refreshAccessToken'
import { env } from 'libs/environment'
import { getTokenStatus } from 'libs/jwt/jwt'
import { storage } from 'libs/storage'

export const eduConnectClient = {
  getLoginUrl() {
    if (!env.API_BASE_URL) throw new Error('API_BASE_URL is undefined, check your config')
    return `${env.API_BASE_URL}/saml/educonnect/login`
  },
  async getAccessToken() {
    const accessToken = await storage.readString('access_token')
    const accessTokenStatus = getTokenStatus(accessToken)
    if (accessTokenStatus === 'unknown') {
      return Promise.reject(new Error('eduConnectClient failed to decodeAccessToken'))
    }
    if (accessTokenStatus === 'expired') {
      const { result, error } = await refreshAccessToken(api)

      if (error) {
        return Promise.reject(new Error(`eduConnectClient ${error}`))
      }

      return result
    }
    return accessToken
  },
}
