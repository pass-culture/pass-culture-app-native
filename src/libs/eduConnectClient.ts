import { EduConnectErrors, EduConnectError } from '@pass-culture/id-check'

import { api } from 'api/api'
import { refreshAccessToken } from 'api/apiHelpers'
import { env } from 'libs/environment'
import { decodeAccessToken } from 'libs/jwt'
import { eventMonitoring } from 'libs/monitoring'
import { storage } from 'libs/storage'

export const eduConnectClient = {
  getLoginUrl() {
    return `${env.API_BASE_URL}/saml/educonnect/login`
  },
  async getAccessToken() {
    const accessToken = await storage.readString('access_token')
    const tokenContent = decodeAccessToken(accessToken ?? '')
    if (!tokenContent) {
      eventMonitoring.captureMessage('eduConnectClient failed to decodeAccessToken')
      return Promise.reject(new EduConnectError(EduConnectErrors.unavailable))
    }
    if (tokenContent.exp * 1000 <= new Date().getTime()) {
      try {
        const refreshedToken = await refreshAccessToken(api)
        return refreshedToken
      } catch (error) {
        eventMonitoring.captureException(error, {
          message: 'eduConnectClient failed to refreshAccessToken',
        })
        return Promise.reject(new EduConnectError(EduConnectErrors.unavailable, error as Error))
      }
    }
    return accessToken
  },
}
