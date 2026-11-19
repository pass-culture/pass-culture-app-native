import { onlineManager } from '@tanstack/react-query'

import { SearchGroupNameEnumv2, TopArtistsPlaylistResponse } from 'api/gen'
import { useTopArtistsPlaylistQuery } from 'features/search/queries/useTopArtistsPlaylistQuery/useTopArtistsPlaylistQuery'
import { env } from 'libs/environment/fixtures'
import { EmptyResponse } from 'libs/fetch'
import { eventMonitoring } from 'libs/monitoring/services'
import * as PackageJson from 'libs/packageJson'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockSearchGroup = SearchGroupNameEnumv2.LIVRES

jest.mock('libs/react-native-device-info/getDeviceId')
jest.spyOn(PackageJson, 'getAppVersion').mockReturnValue('1.10.5')

const fetchApiRecoSpy = jest.spyOn(global, 'fetch')

jest.useFakeTimers()

describe('useTopArtistPlaylistQuery', () => {
  describe('When success API response', () => {
    beforeEach(() => {
      mockServer.getApi<TopArtistsPlaylistResponse>(
        `/v1/recommendation/top_artists_playlist/${mockSearchGroup}`,
        {}
      )
    })

    it('should call top artists playlist API when search group defined', async () => {
      renderHook(
        () =>
          useTopArtistsPlaylistQuery({
            searchGroupName: mockSearchGroup,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(fetchApiRecoSpy).toHaveBeenNthCalledWith(
          1,
          `${env.API_BASE_URL}/native/v1/recommendation/top_artists_playlist/LIVRES`,
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
  })

  describe('When error API response', () => {
    it('should return empty artists array when fetch top artists playlist call fails', async () => {
      mockServer.getApi<EmptyResponse>(
        `/v1/recommendation/top_artists_playlist/${mockSearchGroup}`,
        {
          responseOptions: { statusCode: 503, data: {} },
        }
      )
      const { result } = renderHook(
        () =>
          useTopArtistsPlaylistQuery({
            searchGroupName: mockSearchGroup,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(result.current.data).toEqual({
          artists: [],
        })
      })
    })

    it('should capture an exception when fetch call fails', async () => {
      mockServer.getApi<EmptyResponse>(
        `/v1/recommendation/top_artists_playlist/${mockSearchGroup}`,
        {
          responseOptions: { statusCode: 400, data: {} },
        }
      )
      renderHook(
        () =>
          useTopArtistsPlaylistQuery({
            searchGroupName: mockSearchGroup,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(eventMonitoring.captureException).toHaveBeenCalledWith(
          new Error('Error 400 with top artists playlist endpoint'),
          {
            extra: {
              searchGroupName: mockSearchGroup,
              statusCode: 400,
              errorMessage:
                'Échec de la requête https://localhost/native/v1/recommendation/top_artists_playlist/LIVRES, code: 400',
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
        mockServer.getApi<EmptyResponse>(
          `/v1/recommendation/top_artists_playlist/${mockSearchGroup}`,
          {
            responseOptions: { statusCode, data: {} },
          }
        )
        renderHook(
          () =>
            useTopArtistsPlaylistQuery({
              searchGroupName: mockSearchGroup,
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

    it('should not call top artists playlist API when connection is disabled', () => {
      onlineManager.setOnline(false)

      renderHook(
        () =>
          useTopArtistsPlaylistQuery({
            searchGroupName: mockSearchGroup,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(fetchApiRecoSpy).not.toHaveBeenCalled()
    })

    it('should not call top artists playlist API when search group not defined', () => {
      renderHook(() => useTopArtistsPlaylistQuery({}), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      expect(fetchApiRecoSpy).not.toHaveBeenCalled()
    })
  })
})
