import { api } from 'api/api'
import { navigateToLogin, refreshAccessToken } from 'api/apiHelpers'
import { env } from 'libs/environment'
import { decodeAccessToken } from 'libs/jwt'
import { storage } from 'libs/storage'

export const eduConnectClient = {
  getLoginUrl() {
    return `${env.API_BASE_URL}/saml/educonnect/login`
  },
  async getAccessToken() {
    const accessToken = await storage.readString('access_token')
    const tokenContent = decodeAccessToken(accessToken ?? '')

    if (!tokenContent) {
      return Promise.reject(navigateToLogin())
    }
    if (tokenContent.exp * 1000 <= new Date().getTime()) {
      try {
        const refreshedToken = await refreshAccessToken(api)
        return refreshedToken
      } catch (error) {
        return Promise.reject(navigateToLogin())
      }
    }
    return accessToken
  },
}
