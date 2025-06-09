import { api } from 'api/api'
import { PlaylistResponse } from 'api/gen'
import { EmptyResponse } from 'libs/fetch'
import { eventMonitoring } from 'libs/monitoring/services'
import { mockUseAuthContext } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useHomeRecommendedIdsQuery } from './useHomeRecommendedIdsQuery'

jest.mock('libs/monitoring/services')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')
jest.mock('libs/network/NetInfoWrapper')

describe('useHomeRecommendedIdsQuery', () => {
  it('should capture an exception when fetch call fails', async () => {
    mockServer.postApi<EmptyResponse>('/v1/recommendation/playlist', {
      responseOptions: { statusCode: 400, data: {} },
    })

    renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
          shouldFetch: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('Error 400 with recommendation endpoint'),
        {
          extra: {
            playlistRequestBody: '{}',
            playlistRequestQuery: '{}',
            statusCode: '400',
            errorMessage:
              'Échec de la requête https://localhost/native/v1/recommendation/playlist?, code: 400',
          },
        }
      )
    })
  })

  it('should capture an unknown exception when fetch call fails for unknown reasons', async () => {
    jest.spyOn(api, 'postNativeV1RecommendationPlaylist').mockRejectedValueOnce('some error')

    renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
          shouldFetch: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('Error unknown with recommendation endpoint'),
        {
          extra: {
            playlistRequestBody: '{}',
            playlistRequestQuery: '{}',
            statusCode: 'unknown',
            errorMessage: '"some error"',
          },
        }
      )
    })
  })

  it('should not capture an exception with the error message "Network request failed" when fetch call fails', async () => {
    jest
      .spyOn(api, 'postNativeV1RecommendationPlaylist')
      .mockRejectedValueOnce(new Error('Network request failed'))

    renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
          shouldFetch: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
    })
  })

  it('should capture an exception with the error message when fetch call fails', async () => {
    jest
      .spyOn(api, 'postNativeV1RecommendationPlaylist')
      .mockRejectedValueOnce(new Error('This is an error'))

    renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
          shouldFetch: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('Error This is an error with recommendation endpoint'),
        {
          extra: {
            playlistRequestBody: '{}',
            playlistRequestQuery: '{}',
            statusCode: 'unknown',
            errorMessage: 'This is an error',
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
      mockServer.postApi<EmptyResponse>('/v1/recommendation/playlist', {
        responseOptions: { statusCode, data: {} },
      })

      renderHook(
        () =>
          useHomeRecommendedIdsQuery({
            playlistRequestBody: {},
            playlistRequestQuery: {},
            userId: 1,
            shouldFetch: true,
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

  it('should return playlist offer ids', async () => {
    mockServer.postApi<PlaylistResponse>('/v1/recommendation/playlist', {
      responseOptions: {
        statusCode: 200,
        data: {
          params: {},
          playlistRecommendedOffers: ['102280', '102272', '102249', '102310'],
        },
      },
    })
    const { result } = renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
          shouldFetch: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(result.current.data?.playlistRecommendedOffers).toEqual([
        '102280',
        '102272',
        '102249',
        '102310',
      ])
    })
  })

  it('should not make request if user is disconnected (and undefined in context)', async () => {
    mockServer.postApi<PlaylistResponse>('/v1/recommendation/playlist', {
      responseOptions: {
        data: {
          params: {},
          playlistRecommendedOffers: ['102280', '102272', '102249', '102310'],
        },
      },
    })
    mockUseAuthContext()

    const { result } = renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
          shouldFetch: true,
        }),
      {
        wrapper: (props) => reactQueryProviderHOC(props.children),
      }
    )
    await waitFor(() => {
      expect(result.current.isFetching).toEqual(false)
    })
  })

  it('should not make request when should Fetch is false', async () => {
    mockServer.postApi<PlaylistResponse>('/v1/recommendation/playlist', {
      responseOptions: {
        statusCode: 200,
        data: {
          params: {},
          playlistRecommendedOffers: ['102280', '102272', '102249', '102310'],
        },
      },
    })
    const { result } = renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
          shouldFetch: false,
        }),
      {
        wrapper: (props) => reactQueryProviderHOC(props.children),
      }
    )
    await waitFor(() => {
      expect(result.current.isFetching).toEqual(false)
    })
  })
})
