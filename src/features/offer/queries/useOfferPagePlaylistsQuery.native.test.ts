import { onlineManager } from '@tanstack/react-query'

import { OfferPagePlaylistResponse } from 'api/gen'
import { useOfferPagePlaylistsQuery } from 'features/offer/queries/useOfferPagePlaylistsQuery'
import { env } from 'libs/environment/fixtures'
import { EmptyResponse } from 'libs/fetch'
import { eventMonitoring } from 'libs/monitoring/services'
import * as PackageJson from 'libs/packageJson'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockOfferId = 1
const position = {
  latitude: 6,
  longitude: 22,
}
jest.mock('libs/react-native-device-info/getDeviceId')
jest.spyOn(PackageJson, 'getAppVersion').mockReturnValue('1.10.5')

const fetchApiRecoSpy = jest.spyOn(global, 'fetch')

jest.useFakeTimers()

describe('useOfferPagePlaylistsQuery', () => {
  describe('When success API response', () => {
    beforeEach(() => {
      mockServer.getApi<OfferPagePlaylistResponse>(
        `/v1/recommendation/offer_page_playlists/${mockOfferId}`,
        {}
      )
    })

    it('should call offer page playlists API when offer id provided and user share his position', async () => {
      renderHook(
        () =>
          useOfferPagePlaylistsQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            position,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(fetchApiRecoSpy).toHaveBeenNthCalledWith(
          1,
          `${env.API_BASE_URL}/native/v1/recommendation/offer_page_playlists/1?longitude=22&latitude=6`,
          {
            credentials: 'omit',
            headers: {
              'app-version': '1.10.5',
              'commit-hash': '13371337',
              'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
              platform: 'ios',
              'request-id': 'testUuidV4',
            },
            method: 'GET',
          }
        )
      })
    })

    it('should call offer page playlists API when offer id provided and user logged (userId passed in paramater)', async () => {
      renderHook(
        () =>
          useOfferPagePlaylistsQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            position,
            userId: '1000',
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(fetchApiRecoSpy).toHaveBeenNthCalledWith(
          1,
          `${env.API_BASE_URL}/native/v1/recommendation/offer_page_playlists/1?userId=1000&longitude=22&latitude=6`,
          {
            credentials: 'omit',
            headers: {
              'app-version': '1.10.5',
              'commit-hash': '13371337',
              'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
              platform: 'ios',
              'request-id': 'testUuidV4',
            },
            method: 'GET',
          }
        )
      })
    })

    it('should call offer page playlists API when offer id provided and user not share his position', async () => {
      renderHook(
        () =>
          useOfferPagePlaylistsQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            position: null,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(fetchApiRecoSpy).toHaveBeenNthCalledWith(
          1,
          `${env.API_BASE_URL}/native/v1/recommendation/offer_page_playlists/1?`,
          {
            credentials: 'omit',
            headers: {
              'app-version': '1.10.5',
              'commit-hash': '13371337',
              'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
              platform: 'ios',
              'request-id': 'testUuidV4',
            },
            method: 'GET',
          }
        )
      })
    })

    it('should not call offer page playlists API when offer id provided, user share his position and shouldFetch is false', () => {
      renderHook(
        () =>
          useOfferPagePlaylistsQuery({
            offerId: mockOfferId,
            shouldFetch: false,
            position: { latitude: 10, longitude: 15 },
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(fetchApiRecoSpy).not.toHaveBeenCalled()
    })
  })

  describe('When error API response', () => {
    it('should return empty params and undefined similar offers when fetch similar offers call fails', async () => {
      mockServer.getApi<EmptyResponse>(`/v1/recommendation/offer_page_playlists/${mockOfferId}`, {
        responseOptions: { statusCode: 503, data: {} },
      })
      const { result } = renderHook(
        () =>
          useOfferPagePlaylistsQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            position: null,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(result.current.data).toEqual({
          fromCache: false,
          offerId: String(mockOfferId),
          playlists: [],
        })
      })
    })

    it('should capture an exception when fetch call fails', async () => {
      mockServer.getApi<EmptyResponse>(`/v1/recommendation/offer_page_playlists/${mockOfferId}`, {
        responseOptions: { statusCode: 400, data: {} },
      })
      renderHook(
        () =>
          useOfferPagePlaylistsQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            position: null,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(eventMonitoring.captureException).toHaveBeenCalledWith(
          new Error('Error 400 with offer page playlists endpoint to get recommended offers'),
          {
            extra: {
              latitude: undefined,
              longitude: undefined,
              offerId: 1,
              retrievalModel: undefined,
              statusCode: 400,
              errorMessage:
                'Échec de la requête https://localhost/native/v1/recommendation/offer_page_playlists/1?, code: 400',
            },
          }
        )
      })
    })

    it.each([
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ])(
      'should not capture an exception when fetch call fails if ApiError and error code is %s',
      async (statusCode) => {
        mockServer.getApi<EmptyResponse>(`/v1/recommendation/offer_page_playlists/${mockOfferId}`, {
          responseOptions: { statusCode, data: {} },
        })
        renderHook(
          () =>
            useOfferPagePlaylistsQuery({
              offerId: mockOfferId,
              shouldFetch: true,
              position: null,
            }),
          {
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await waitFor(() => {
          expect(eventMonitoring.captureException).not.toHaveBeenCalled()
        })
      }
    )

    it('should not call offer page playlists API when connection is disabled', () => {
      onlineManager.setOnline(false)

      renderHook(
        () =>
          useOfferPagePlaylistsQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            position: { latitude: 10, longitude: 15 },
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(fetchApiRecoSpy).not.toHaveBeenCalled()
    })
  })
})
