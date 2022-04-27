import { JwtPayload } from 'jwt-decode'

import * as jwt from '__mocks__/jwt-decode'
import * as Keychain from 'libs/keychain'

import { NeedsAuthenticationResponse, safeFetch } from '../apiHelpers'
import { DefaultApi } from '../gen'

const api = new DefaultApi({})

const outdatedToken = {
  exp: new Date().getTime() / 1000 - 1,
} as JwtPayload

const respondWith = async (body: unknown): Promise<Response> => {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
    },
  })
}

describe('[api] helpers', () => {
  const mockFetch = jest.spyOn(global, 'fetch')
  const mockJwt = jest.spyOn(jwt, 'default')
  const mockKeychain = jest.spyOn(Keychain, 'getRefreshToken')

  describe('[method] safeFetch', () => {
    it('should call fetch with populated header', async () => {
      mockFetch.mockResolvedValueOnce(respondWith('apiResponse'))
      const response = await safeFetch('url', {}, api)
      expect(mockFetch).toHaveBeenCalledWith('url', {
        headers: {
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual(await respondWith('apiResponse'))
    })
    it('should call fetch with populated header when route is in NotAuthenticatedCalls', async () => {
      mockFetch.mockResolvedValueOnce(respondWith('apiResponse'))
      const response = await safeFetch('native/v1/account', {}, api)
      expect(mockFetch).toHaveBeenCalledWith('native/v1/account', {
        headers: {
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual(await respondWith('apiResponse'))
    })

    it('needs authentication response when refresh token fails', async () => {
      mockJwt.mockReturnValueOnce(outdatedToken)
      mockFetch.mockRejectedValueOnce('some error')

      const response = await safeFetch('/native/v1/me', {}, api)

      expect(response).toEqual(NeedsAuthenticationResponse)
    })

    it('regenerates the access token and fetch the real url after when the access token is expired', async () => {
      const accessToken = 'some fake access token'
      const apiUrl = '/native/v1/me'
      mockJwt.mockReturnValueOnce(outdatedToken)
      const expectedResponse = respondWith('some api response')
      mockFetch
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)

      const response = await safeFetch(apiUrl, {}, api)

      expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual(await expectedResponse)
    })

    it('needs authentication response when there is no access token', async () => {
      mockJwt.mockReturnValueOnce(null)

      const response = await safeFetch('/native/v1/me', {}, api)

      expect(response).toEqual(NeedsAuthenticationResponse)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('needs authentication response when there is no refresh token', async () => {
      mockJwt.mockReturnValueOnce(outdatedToken)
      mockKeychain.mockResolvedValueOnce(null)

      const response = await safeFetch('/native/v1/me', {}, api)

      expect(response).toEqual(NeedsAuthenticationResponse)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})
